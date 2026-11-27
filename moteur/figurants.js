// Les figurants : des élèves en gris, tous pareils, qu'on ne peut pas aborder.
// La plupart sont assis aux tables, quelques-uns se promènent. La nuit, ils dorment au dortoir.
import * as THREE from 'three';
import { geometriesSilhouette, creerSilhouette } from '../personnages/modele.js';
import { FIGURANT } from '../personnages/personnages.js';

const NB_ASSIS = 18;
const NB_PROMENEURS = 6;
const VITESSE = 0.9;

function hasard(graine) {
  let s = graine;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

export function creerFigurants(scene, salle, occupees) {
  const alea = hasard(7);
  const look = { robe: FIGURANT.robe, col: FIGURANT.col, peau: FIGURANT.peau, chapeau: FIGURANT.chapeau };
  const geoAssis = geometriesSilhouette({ ...look, assis: true });
  const geoDebout = geometriesSilhouette({ ...look, assis: false });
  const groupe = new THREE.Group();
  scene.add(groupe);

  // ---------- assis aux tables ----------
  const libres = (salle.sieges ?? []).filter((s) => !occupees.some((o) => Math.hypot(o.x - s.x, o.z - s.z) < 1.2));
  for (let i = libres.length - 1; i > 0; i--) { const j = Math.floor(alea() * (i + 1)); [libres[i], libres[j]] = [libres[j], libres[i]]; }
  const assis = libres.slice(0, NB_ASSIS).map((siege) => {
    const s = creerSilhouette(geoAssis, FIGURANT.echelle);
    s.groupe.position.set(siege.x, 0, siege.z);
    s.groupe.rotation.y = siege.angle;
    groupe.add(s.groupe);
    return { s, phase: alea() * 20, vitesse: 0.2 + alea() * 0.4 };
  });

  // ---------- ceux qui se promènent ----------
  const zone = salle.promenade;
  function destination(joueur) {
    for (let essai = 0; essai < 10; essai++) {
      const r = alea() < 0.75 ? zone.allee : zone.entree;
      const v = new THREE.Vector3(r.minX + alea() * (r.maxX - r.minX), 0, r.minZ + alea() * (r.maxZ - r.minZ));
      if (!joueur || Math.hypot(v.x - joueur.x, v.z - joueur.z) > 2.5) return v;
    }
    return new THREE.Vector3(0, 0, zone.allee.minZ);
  }
  function chemin(depuis, vers) {
    const seuil = zone.entree.minZ;
    if ((depuis.z >= seuil) === (vers.z >= seuil)) return [vers];
    const devant = depuis.z >= seuil ? depuis : vers;
    const lim = zone.allee;
    const passage = new THREE.Vector3(Math.max(lim.minX, Math.min(lim.maxX, devant.x)), 0, seuil);
    return [passage, vers];
  }
  const promeneurs = [];
  for (let i = 0; i < NB_PROMENEURS; i++) {
    const s = creerSilhouette(geoDebout, FIGURANT.echelle);
    const pos = destination(salle.depart);
    s.groupe.position.copy(pos);
    s.groupe.rotation.y = alea() * Math.PI * 2;
    groupe.add(s.groupe);
    promeneurs.push({ s, pos, route: [], attente: alea() * 4, lacet: s.groupe.rotation.y, pas: alea() * 10 });
  }

  function mettreAJour(t, dt, joueur) {
    if (!groupe.visible) return;
    for (const f of assis) {
      // ils tournent la tête vers leurs voisins, de temps en temps
      const v = Math.sin(t * f.vitesse + f.phase);
      f.s.tete.rotation.y = Math.sign(v) * Math.min(1, Math.abs(v) * 1.6) * 0.6;
    }
    const k = 1 - Math.exp(-dt * 5);
    for (const f of promeneurs) {
      const g = f.s.groupe;
      if (f.attente > 0) { f.attente -= dt; g.position.y = 0; continue; }
      if (!f.route.length) { f.route = chemin(f.pos, destination(joueur)); }
      const but = f.route[0];
      const dx = but.x - f.pos.x, dz = but.z - f.pos.z;
      const d = Math.hypot(dx, dz);
      // on laisse passer le joueur
      if (Math.hypot(joueur.x - f.pos.x, joueur.z - f.pos.z) < 0.8 &&
          (dx * (joueur.x - f.pos.x) + dz * (joueur.z - f.pos.z)) > 0) { f.attente = 0.6; continue; }
      if (d < 0.05) {
        f.route.shift();
        if (!f.route.length) f.attente = 1.5 + alea() * 5;
        continue;
      }
      const pas = Math.min(d, VITESSE * dt);
      f.pos.x += (dx / d) * pas; f.pos.z += (dz / d) * pas;
      const voulu = Math.atan2(dx, dz);
      f.lacet += Math.atan2(Math.sin(voulu - f.lacet), Math.cos(voulu - f.lacet)) * k;
      f.pas += dt * 8;
      g.position.set(f.pos.x, Math.abs(Math.sin(f.pas)) * 0.04, f.pos.z);
      g.rotation.set(0, f.lacet, Math.sin(f.pas) * 0.04);
    }
  }

  function reglerMoment(moment) { groupe.visible = moment === 'jour'; }

  return { mettreAJour, reglerMoment };
}
