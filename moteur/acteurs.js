// Place les personnages principaux dans la salle selon leur emploi du temps,
// les fait regarder le joueur et se tourner vers lui pendant une conversation.
import * as THREE from 'three';
import { geometriesSilhouette, creerSilhouette } from '../personnages/modele.js';
import { personnages, MAISONS } from '../personnages/personnages.js';

const ROBE = 0x1d1a24;
const matZone = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false });
const zoneDebout = new THREE.CylinderGeometry(0.45, 0.45, 1.85, 8).translate(0, 0.92, 0);
const zoneAssis = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 8).translate(0, 0.75, 0.1);

function angleVers(dx, dz) { return Math.atan2(dx, dz); }
function ecart(a) { return Math.atan2(Math.sin(a), Math.cos(a)); }

export function creerActeurs(scene, idSalle) {
  const acteurs = [];
  const cliquables = [];
  const obstacles = [];

  for (const p of personnages) {
    const emploi = p.emploi[idSalle];
    if (!emploi) continue;
    acteurs.push({ perso: p, emploi, modeles: {}, s: null, place: null, lacet: 0, phase: Math.random() * 10, lumiere: null });
  }

  function modele(a, pose) {
    if (a.modeles[pose]) return a.modeles[pose];
    const p = a.perso;
    const geos = geometriesSilhouette({
      assis: pose === 'assis', robe: ROBE, col: MAISONS[p.maison].couleur,
      peau: p.peau, cheveux: p.cheveux, coiffure: p.coiffure, objet: p.objet,
    });
    const s = creerSilhouette(geos, p.echelle ?? 1);
    const zone = new THREE.Mesh(pose === 'assis' ? zoneAssis : zoneDebout, matZone);
    zone.userData.acteur = a;
    s.groupe.add(zone);
    s.zone = zone;
    if (s.lueur) {
      a.lumiere = new THREE.PointLight(0xffc870, 0, 7, 2);
      a.lumiere.position.copy(s.lueur.userData.centre);
      s.groupe.add(a.lumiere);
    }
    s.groupe.visible = false;
    scene.add(s.groupe);
    a.modeles[pose] = s;
    return s;
  }

  // moment : 'jour' ou 'nuit'. creneau : 'matin', 'apres-midi', 'soir' ou 'nuit'.
  // On cherche d'abord une ligne pour le créneau précis (ex. « soir »), sinon « jour » / « nuit ».
  function reglerMoment(moment, creneau = moment) {
    cliquables.length = 0;
    obstacles.length = 0;
    for (const a of acteurs) {
      for (const s of Object.values(a.modeles)) s.groupe.visible = false;
      a.place = a.emploi[creneau] ?? a.emploi[moment] ?? null;
      a.s = null;
      if (!a.place) continue;
      const s = modele(a, a.place.pose);
      a.s = s;
      a.lacet = (a.place.orientation * Math.PI) / 180;
      s.groupe.position.set(a.place.x, 0, a.place.z);
      s.groupe.rotation.y = a.lacet;
      s.tete.rotation.y = 0;
      s.groupe.visible = true;
      cliquables.push(s.zone);
      if (a.place.pose === 'debout') {
        obstacles.push({ minX: a.place.x - 0.3, maxX: a.place.x + 0.3, minZ: a.place.z - 0.3, maxZ: a.place.z + 0.3 });
      }
      if (s.lueur) {
        s.lueur.material.color.set(moment === 'nuit' ? 0xffd27a : 0x9a7a40);
        a.lumiere.intensity = moment === 'nuit' ? 5 : 0;
      }
    }
  }

  // Les places assises occupées par les personnages (pour que les figurants ne s'y mettent pas)
  function placesOccupees(moment) {
    return acteurs.map((a) => a.emploi[moment]).filter((pl) => pl && pl.pose === 'assis');
  }

  function mettreAJour(t, dt, joueur, interlocuteur) {
    const k = 1 - Math.exp(-dt * 4);
    for (const a of acteurs) {
      if (!a.s) continue;
      const g = a.s.groupe;
      const dx = joueur.x - g.position.x, dz = joueur.z - g.position.z;
      const dist = Math.hypot(dx, dz);
      const versJoueur = angleVers(dx, dz);
      const parle = a === interlocuteur;
      // debout : il se tourne vers toi quand tu lui parles
      const base = (a.place.orientation * Math.PI) / 180;
      const cible = parle && a.place.pose === 'debout' ? versJoueur : base;
      a.lacet += ecart(cible - a.lacet) * k;
      g.rotation.y = a.lacet;
      // la tête suit le joueur quand il est proche
      let tete = Math.sin(t * 0.4 + a.phase) * 0.15;
      if (parle || dist < 4) tete = Math.max(-1.1, Math.min(1.1, ecart(versJoueur - a.lacet)));
      a.s.tete.rotation.y += (tete - a.s.tete.rotation.y) * k;
      // respiration
      const e = a.perso.echelle ?? 1;
      g.scale.set(e, e * (1 + Math.sin(t * 2 + a.phase) * 0.008), e);
    }
  }

  return { acteurs, cliquables, obstacles, reglerMoment, placesOccupees, mettreAJour };
}
