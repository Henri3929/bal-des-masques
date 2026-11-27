// Contrôles tactiles : toucher le sol pour marcher, glisser le doigt pour regarder,
// toucher un personnage pour lui parler. Marche aussi à la souris sur ordinateur.
import * as THREE from 'three';

const HAUTEUR_YEUX = 1.65;
const VITESSE = 2.6;        // mètres par seconde
const RAYON_JOUEUR = 0.35;  // pour ne pas traverser les tables
const SEUIL_GLISSE = 10;    // pixels : au-delà, c'est un glissé et pas un toucher
const DISTANCE_PAROLE = 5;  // plus loin que ça, on s'approche d'abord

export class Controles {
  constructor(camera, element, salle, scene, acteurs) {
    this.camera = camera;
    this.element = element;
    this.salle = salle;
    this.acteurs = acteurs;
    this.lacet = salle.depart.lacet ?? 0;   // regarder à gauche / à droite
    this.tangage = 0;                        // regarder en haut / en bas
    this.position = new THREE.Vector3(salle.depart.x, 0, salle.depart.z);
    this.cible = null;
    this.hauteurSol = salle.hauteurSol(this.position.x, this.position.z);
    this.balancement = 0;
    this.doigt = null;
    this.raycaster = new THREE.Raycaster();
    this.surPremierGeste = null;
    this.surParler = null;      // appelé quand on aborde un personnage
    this.aParler = null;        // personnage vers qui on marche
    this.enDialogue = false;
    this.regard = null;         // ce que la caméra regarde pendant un dialogue
    this._v = new THREE.Vector3();

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
    if (this.doigt || this.enDialogue) return; // on ne suit qu'un doigt à la fois
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
    if (!d.glisse && !this.enDialogue) this.toucher(e.clientX, e.clientY);
  }

  toucher(x, y) {
    const ndc = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);
    this.raycaster.setFromCamera(ndc, this.camera);
    const objets = this.acteurs ? [...this.salle.cliquables, ...this.acteurs.cliquables] : this.salle.cliquables;
    const touche = this.raycaster.intersectObjects(objets, true)[0];
    if (!touche) return;
    this.geste();
    const acteur = touche.object.userData.acteur;
    if (acteur) { this.allerVers(acteur); return; }
    this.aParler = null;
    this.marcherVers(touche.point.x, touche.point.z);
  }

  marcherVers(x, z) {
    const lim = this.salle.limites;
    const cx = Math.max(lim.minX, Math.min(lim.maxX, x));
    const cz = Math.max(lim.minZ, Math.min(lim.maxZ, z));
    this.cible = new THREE.Vector3(cx, 0, cz);
    this.marque.position.set(cx, this.salle.hauteurSol(cx, cz) + 0.02, cz);
    this.marque.material.opacity = 0.9;
    this.marque.scale.setScalar(1);
  }

  // Toucher un personnage : s'il est proche on lui parle, sinon on s'approche d'abord.
  allerVers(acteur) {
    const p = acteur.s.groupe.position;
    const dx = this.position.x - p.x, dz = this.position.z - p.z;
    const dist = Math.hypot(dx, dz);
    if (dist < DISTANCE_PAROLE) { this.parler(acteur); return; }
    this.aParler = acteur;
    this.marcherVers(p.x + (dx / dist) * 1.4, p.z + (dz / dist) * 1.4);
  }

  parler(acteur) {
    this.aParler = null;
    this.cible = null;
    if (this.surParler) this.surParler(acteur);
  }

  annulerParole() { this.aParler = null; this.cible = null; }

  geste() {
    if (this.surPremierGeste) { this.surPremierGeste(); this.surPremierGeste = null; }
  }

  bloque(x, z) {
    const lim = this.salle.limites;
    if (x < lim.minX || x > lim.maxX || z < lim.minZ || z > lim.maxZ) return true;
    const listes = this.acteurs ? [this.salle.obstacles, this.acteurs.obstacles] : [this.salle.obstacles];
    for (const liste of listes) for (const o of liste) {
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
    // arrivé près du personnage (ou bloqué en chemin) : on lui parle
    if (this.aParler) {
      const p = this.aParler.s?.groupe.position;
      if (!p) this.aParler = null;
      else if (!this.cible || Math.hypot(p.x - this.position.x, p.z - this.position.z) < 1.6) this.parler(this.aParler);
    }

    // Monter doucement les marches de l'estrade
    const sol = this.salle.hauteurSol(this.position.x, this.position.z);
    this.hauteurSol += (sol - this.hauteurSol) * Math.min(1, dt * 8);

    // Léger balancement de la tête en marchant
    if (marche) this.balancement += dt * 9;
    const bob = marche ? Math.sin(this.balancement) * 0.035 : 0;

    this.camera.position.set(this.position.x, this.hauteurSol + HAUTEUR_YEUX + bob, this.position.z);

    // Pendant une conversation, on tourne doucement le regard vers le visage
    if (this.enDialogue && this.regard) {
      const v = this.regard.getWorldPosition(this._v);
      const dx = v.x - this.camera.position.x, dy = v.y - this.camera.position.y, dz = v.z - this.camera.position.z;
      const lacet = Math.atan2(-dx, -dz);
      const tangage = Math.atan2(dy, Math.hypot(dx, dz)) - 0.12; // un peu plus bas pour laisser la bulle
      const k = 1 - Math.exp(-dt * 4);
      this.lacet += Math.atan2(Math.sin(lacet - this.lacet), Math.cos(lacet - this.lacet)) * k;
      this.tangage += (tangage - this.tangage) * k;
    }
    this.camera.rotation.set(this.tangage, this.lacet, 0);

    // Le cercle s'efface peu à peu
    const m = this.marque.material;
    if (m.opacity > 0) {
      m.opacity = Math.max(0, m.opacity - dt * (this.cible ? 0.4 : 2.5));
      this.marque.scale.setScalar(1 + (0.9 - m.opacity) * 0.5);
    }
  }
}
