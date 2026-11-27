// Contrôles tactiles : toucher le sol pour marcher, glisser le doigt pour regarder.
// Marche aussi à la souris sur ordinateur.
import * as THREE from 'three';

const HAUTEUR_YEUX = 1.65;
const VITESSE = 2.6;        // mètres par seconde
const RAYON_JOUEUR = 0.35;  // pour ne pas traverser les tables
const SEUIL_GLISSE = 10;    // pixels : au-delà, c'est un glissé et pas un toucher

export class Controles {
  constructor(camera, element, salle, scene) {
    this.camera = camera;
    this.element = element;
    this.salle = salle;
    this.lacet = salle.depart.lacet ?? 0;   // regarder à gauche / à droite
    this.tangage = 0;                        // regarder en haut / en bas
    this.position = new THREE.Vector3(salle.depart.x, 0, salle.depart.z);
    this.cible = null;
    this.hauteurSol = salle.hauteurSol(this.position.x, this.position.z);
    this.balancement = 0;
    this.doigt = null;
    this.raycaster = new THREE.Raycaster();
    this.surPremierGeste = null;

    // Petit cercle qui montre où l'on va
    this.marque = new THREE.Mesh(
      new THREE.RingGeometry(0.18, 0.26, 24).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0xffe2a0, transparent: true, opacity: 0, depthWrite: false })
    );
    scene.add(this.marque);

    element.style.touchAction = 'none';
    element.addEventListener('pointerdown', (e) => this.appui(e));
    element.addEventListener('pointermove', (e) => this.mouvement(e));
    element.addEventListener('pointerup', (e) => this.relache(e));
    element.addEventListener('pointercancel', () => { this.doigt = null; });
    element.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  appui(e) {
    if (this.doigt) return; // on ne suit qu'un doigt à la fois
    this.doigt = { id: e.pointerId, x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, glisse: false };
    this.element.setPointerCapture?.(e.pointerId);
  }

  mouvement(e) {
    const d = this.doigt;
    if (!d || d.id !== e.pointerId) return;
    if (!d.glisse && Math.hypot(e.clientX - d.x0, e.clientY - d.y0) > SEUIL_GLISSE) d.glisse = true;
    if (d.glisse) {
      const largeur = Math.max(window.innerWidth, 1);
      const echelle = (Math.PI * 0.8) / largeur;
      this.lacet -= (e.clientX - d.x) * echelle;
      this.tangage -= (e.clientY - d.y) * echelle;
      this.tangage = Math.max(-1.2, Math.min(1.2, this.tangage));
      this.geste();
    }
    d.x = e.clientX;
    d.y = e.clientY;
  }

  relache(e) {
    const d = this.doigt;
    if (!d || d.id !== e.pointerId) return;
    this.doigt = null;
    if (!d.glisse) this.toucher(e.clientX, e.clientY);
  }

  toucher(x, y) {
    const ndc = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);
    this.raycaster.setFromCamera(ndc, this.camera);
    const touche = this.raycaster.intersectObjects(this.salle.cliquables, true)[0];
    if (!touche) return;
    // Plus tard : si c'est un personnage, on lui parle. Pour l'instant : on marche.
    const p = touche.point;
    const lim = this.salle.limites;
    const cx = Math.max(lim.minX, Math.min(lim.maxX, p.x));
    const cz = Math.max(lim.minZ, Math.min(lim.maxZ, p.z));
    this.cible = new THREE.Vector3(cx, 0, cz);
    this.marque.position.set(cx, this.salle.hauteurSol(cx, cz) + 0.02, cz);
    this.marque.material.opacity = 0.9;
    this.marque.scale.setScalar(1);
    this.geste();
  }

  geste() {
    if (this.surPremierGeste) { this.surPremierGeste(); this.surPremierGeste = null; }
  }

  bloque(x, z) {
    const lim = this.salle.limites;
    if (x < lim.minX || x > lim.maxX || z < lim.minZ || z > lim.maxZ) return true;
    for (const o of this.salle.obstacles) {
      if (x > o.minX - RAYON_JOUEUR && x < o.maxX + RAYON_JOUEUR &&
          z > o.minZ - RAYON_JOUEUR && z < o.maxZ + RAYON_JOUEUR) return true;
    }
    return false;
  }

  mettreAJour(dt, t) {
    let marche = false;
    if (this.cible) {
      const dx = this.cible.x - this.position.x;
      const dz = this.cible.z - this.position.z;
      const dist = Math.hypot(dx, dz);
      if (dist < 0.05) {
        this.cible = null;
      } else {
        const pas = Math.min(dist, VITESSE * dt);
        const nx = this.position.x + (dx / dist) * pas;
        const nz = this.position.z + (dz / dist) * pas;
        if (!this.bloque(nx, nz)) { this.position.x = nx; this.position.z = nz; marche = true; }
        else if (!this.bloque(nx, this.position.z)) { this.position.x = nx; marche = true; }
        else if (!this.bloque(this.position.x, nz)) { this.position.z = nz; marche = true; }
        else this.cible = null; // coincé : on s'arrête
      }
    }

    // Monter doucement les marches de l'estrade
    const sol = this.salle.hauteurSol(this.position.x, this.position.z);
    this.hauteurSol += (sol - this.hauteurSol) * Math.min(1, dt * 8);

    // Léger balancement de la tête en marchant
    if (marche) this.balancement += dt * 9;
    const bob = marche ? Math.sin(this.balancement) * 0.035 : 0;

    this.camera.position.set(this.position.x, this.hauteurSol + HAUTEUR_YEUX + bob, this.position.z);
    this.camera.rotation.set(this.tangage, this.lacet, 0);

    // Le cercle s'efface peu à peu
    const m = this.marque.material;
    if (m.opacity > 0) {
      m.opacity = Math.max(0, m.opacity - dt * (this.cible ? 0.4 : 2.5));
      this.marque.scale.setScalar(1 + (0.9 - m.opacity) * 0.5);
    }
  }
}
