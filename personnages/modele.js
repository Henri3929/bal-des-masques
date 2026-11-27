// Modèle low-poly d'un élève : robe de sorcier, tête, coiffure et objet distinctif.
// Toutes les pièces sont fusionnées en un seul morceau (plus léger pour le téléphone),
// sauf la tête, à part pour pouvoir la tourner.
import * as THREE from 'three';

const matCorps = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });
const NOIR = 0x141012;

// ---------- assemblage ----------
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new THREE.Vector3(), _s = new THREE.Vector3();
function piece(geo, couleur, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
  _q.setFromEuler(_e.set(rx, ry, rz));
  geo.applyMatrix4(_m.compose(_v.set(x, y, z), _q, _s.set(sx, sy, sz)));
  return { geo, couleur };
}
function assembler(pieces) {
  const pos = [], col = [];
  const c = new THREE.Color();
  for (const { geo, couleur } of pieces) {
    const g = geo.index ? geo.toNonIndexed() : geo;
    c.set(couleur);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { pos.push(p.getX(i), p.getY(i), p.getZ(i)); col.push(c.r, c.g, c.b); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
}
const cyl = (rh, rb, h, n = 8) => new THREE.CylinderGeometry(rh, rb, h, n);
const cube = (l, h, p) => new THREE.BoxGeometry(l, h, p);
const bille = (r, d = 0) => new THREE.IcosahedronGeometry(r, d);

// ---------- fabrication des formes ----------
// o : { assis, robe, col, peau, cheveux, coiffure, objet, chapeau }
export function geometriesSilhouette(o) {
  const assis = !!o.assis;
  const yB = assis ? 0.55 : 0.85;   // bas du buste
  const C = [];                      // pièces du corps
  const T = [];                      // pièces de la tête (centrée sur le cou)
  const hc = 0.14;                   // hauteur du centre de la tête au-dessus du cou

  // bas de la robe, ou jambes repliées si assis
  if (!assis) {
    C.push(piece(cyl(0.24, 0.36, yB), o.robe, 0, yB / 2, 0));
  } else {
    C.push(piece(cube(0.42, 0.18, 0.5), o.robe, 0, 0.57, 0.1));
    C.push(piece(cube(0.38, 0.5, 0.16), o.robe, 0, 0.25, 0.32));
  }
  // buste, col, cravate, cou
  C.push(piece(cyl(0.19, 0.24, 0.5), o.robe, 0, yB + 0.25, 0));
  C.push(piece(cyl(0.2, 0.21, 0.07), o.col, 0, yB + 0.5, 0));
  C.push(piece(cube(0.06, 0.24, 0.03), o.col, 0, yB + 0.33, 0.21));
  C.push(piece(cyl(0.065, 0.07, 0.12, 6), o.peau, 0, yB + 0.56, 0));
  // bras et mains
  for (const s of [-1, 1]) {
    if (!assis) {
      C.push(piece(cyl(0.06, 0.075, 0.55, 6), o.robe, s * 0.265, yB + 0.2, 0, 0, 0, s * 0.12));
      C.push(piece(bille(0.065), o.peau, s * 0.3, yB - 0.1, 0));
    } else {
      C.push(piece(cyl(0.06, 0.075, 0.42, 6), o.robe, s * 0.24, yB + 0.37, 0.17, -1.12));
      C.push(piece(bille(0.065), o.peau, s * 0.22, 0.84, 0.34));
    }
  }

  // tête et yeux
  T.push(piece(bille(0.16, 1), o.peau, 0, hc, 0));
  for (const s of [-1, 1]) T.push(piece(cube(0.026, 0.032, 0.02), NOIR, s * 0.056, hc - 0.005, 0.15));

  // coiffure
  if (o.coiffure) {
    T.push(piece(new THREE.SphereGeometry(0.172, 9, 6, 0, Math.PI * 2, 0, Math.PI * 0.55), o.cheveux, 0, hc + 0.01, -0.01, -0.4));
    if (o.coiffure === 'long') {
      T.push(piece(cube(0.3, 0.36, 0.09), o.cheveux, 0, hc - 0.13, -0.12));
      for (const s of [-1, 1]) T.push(piece(cube(0.06, 0.28, 0.16), o.cheveux, s * 0.15, hc - 0.08, -0.03));
    }
    if (o.coiffure === 'queue') {
      T.push(piece(bille(0.07), o.cheveux, 0, hc + 0.03, -0.18));
      T.push(piece(cyl(0.05, 0.025, 0.28, 6), o.cheveux, 0, hc - 0.12, -0.21, 0.2));
    }
    if (o.coiffure === 'boucles') {
      for (let i = 0; i < 7; i++) {
        const a = Math.PI * 0.35 + (i / 6) * Math.PI * 1.3;
        T.push(piece(bille(0.065), o.cheveux, Math.cos(a) * 0.16, hc - 0.06 + (i % 2) * 0.05, -Math.sin(a) * 0.16 - 0.02));
      }
    }
  }
  // chapeau pointu des figurants
  if (o.chapeau) {
    T.push(piece(cyl(0.27, 0.27, 0.025, 10), o.chapeau, 0, hc + 0.1, 0));
    T.push(piece(cyl(0.01, 0.17, 0.42, 8), o.chapeau, 0, hc + 0.31, -0.02, -0.15));
  }

  // objets distinctifs
  let lueur = null;
  switch (o.objet) {
    case 'echarpe': { // écharpe rayée
      C.push(piece(new THREE.TorusGeometry(0.13, 0.05, 5, 10), 0x9b1b1f, 0, yB + 0.5, 0, Math.PI / 2));
      for (let i = 0; i < 6; i++) C.push(piece(cube(0.1, 0.07, 0.035), i % 2 ? 0xd9b24a : 0x9b1b1f, 0.09, yB + 0.43 - i * 0.07, 0.225 - i * 0.004, 0, 0, 0.05));
      break;
    }
    case 'lunettes': { // lunettes roses
      for (const s of [-1, 1]) T.push(piece(new THREE.TorusGeometry(0.045, 0.012, 4, 10), 0xff5fa8, s * 0.06, hc - 0.01, 0.155));
      T.push(piece(cube(0.04, 0.014, 0.014), 0xff5fa8, 0, hc - 0.005, 0.16));
      break;
    }
    case 'insigne': { // insigne de capitaine
      C.push(piece(cyl(0.08, 0.08, 0.02, 5), 0xe6bd4c, -0.1, yB + 0.33, 0.215, Math.PI / 2));
      C.push(piece(cyl(0.04, 0.04, 0.02, 5), 0xb3161c, -0.1, yB + 0.33, 0.225, Math.PI / 2));
      break;
    }
    case 'lanterne': { // lanterne tenue à la main
      const lx = -0.3, ly = yB - 0.3, lz = 0.04;
      C.push(piece(new THREE.TorusGeometry(0.04, 0.01, 4, 8), 0x2a2522, lx, ly + 0.15, lz));
      for (const dy of [0.1, -0.1]) C.push(piece(cube(0.17, 0.03, 0.17), 0x2a2522, lx, ly + dy, lz));
      for (const [dx, dz] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) C.push(piece(cube(0.02, 0.2, 0.02), 0x2a2522, lx + dx * 0.07, ly, lz + dz * 0.07));
      lueur = { geo: cube(0.11, 0.16, 0.11), x: lx, y: ly, z: lz };
      lueur.geo.translate(lx, ly, lz);
      break;
    }
    case 'bonnet': { // bonnet vert
      T.push(piece(cyl(0.18, 0.18, 0.07, 9), 0x24703a, 0, hc + 0.075, 0));
      T.push(piece(cyl(0.02, 0.175, 0.26, 9), 0x2e8b3e, 0, hc + 0.24, -0.01, -0.12));
      T.push(piece(bille(0.05), 0xd8ead0, 0, hc + 0.37, -0.04));
      break;
    }
    case 'rose': { // rose rouge : une à la main, une épinglée
      C.push(piece(bille(0.045), 0xc8102e, -0.1, yB + 0.36, 0.215));
      if (!assis) {
        C.push(piece(cyl(0.008, 0.008, 0.24, 4), 0x2f6a2a, 0.3, yB, 0.06));
        C.push(piece(bille(0.065), 0xc8102e, 0.3, yB + 0.14, 0.06));
      }
      break;
    }
    case 'col': { // haut col argenté
      C.push(piece(cyl(0.21, 0.16, 0.17, 8), 0xcdd2dc, 0, yB + 0.57, 0));
      break;
    }
    case 'carnet': { // carnet noir
      if (!assis) {
        C.push(piece(cube(0.05, 0.22, 0.16), 0x18161a, 0.31, yB - 0.04, 0.07, 0, 0, 0.12));
        C.push(piece(cube(0.035, 0.2, 0.005), 0xe8dfc8, 0.31, yB - 0.04, 0.152, 0, 0, 0.12));
      } else {
        C.push(piece(cube(0.17, 0.035, 0.22), 0x18161a, 0, 0.86, 0.36));
        C.push(piece(cube(0.15, 0.006, 0.2), 0xe8dfc8, 0, 0.88, 0.36));
      }
      break;
    }
    case 'ruban': { // ruban vert noué dans les cheveux
      T.push(piece(bille(0.035), 0x2e9d5a, 0, hc + 0.07, -0.17));
      for (const s of [-1, 1]) {
        T.push(piece(cube(0.1, 0.065, 0.02), 0x2e9d5a, s * 0.06, hc + 0.08, -0.175, 0, 0, s * 0.35));
        T.push(piece(cube(0.03, 0.16, 0.012), 0x24804a, s * 0.025, hc - 0.02, -0.18, 0, 0, s * 0.15));
      }
      break;
    }
    case 'chat': { // chat noir sur l'épaule
      const cx = -0.25, cy = yB + 0.6;
      C.push(piece(bille(0.1, 1), 0x161418, cx, cy, -0.03, 0, 0, 0, 0.9, 0.75, 1.25));
      C.push(piece(bille(0.065, 1), 0x161418, cx, cy + 0.09, 0.1));
      for (const s of [-1, 1]) {
        C.push(piece(new THREE.ConeGeometry(0.022, 0.05, 4), 0x161418, cx + s * 0.035, cy + 0.155, 0.1));
        C.push(piece(cube(0.016, 0.012, 0.01), 0xf2c232, cx + s * 0.024, cy + 0.1, 0.163));
      }
      C.push(piece(cyl(0.018, 0.012, 0.3, 5), 0x161418, cx - 0.04, cy - 0.15, -0.14, 0.35));
      break;
    }
    case 'plume': { // plume blanche dans les cheveux
      T.push(piece(new THREE.ConeGeometry(0.04, 0.36, 4), 0xf6f6fa, 0.14, hc + 0.18, -0.04, 0, 0, -0.5, 1, 1, 0.35));
      break;
    }
  }

  return { corps: assembler(C), tete: assembler(T), lueur, yCou: yB + 0.6, hc };
}

// Crée un personnage à partir des formes. Renvoie le groupe, la tête (qui peut tourner)
// et le point à regarder pendant une conversation.
export function creerSilhouette(geos, echelle = 1) {
  const groupe = new THREE.Group();
  groupe.add(new THREE.Mesh(geos.corps, matCorps));
  const tete = new THREE.Group();
  tete.position.y = geos.yCou;
  tete.add(new THREE.Mesh(geos.tete, matCorps));
  const yeux = new THREE.Object3D();
  yeux.position.y = geos.hc;
  tete.add(yeux);
  groupe.add(tete);
  let lueur = null;
  if (geos.lueur) {
    lueur = new THREE.Mesh(geos.lueur.geo, new THREE.MeshBasicMaterial({ color: 0xffd27a }));
    lueur.userData.centre = new THREE.Vector3(geos.lueur.x, geos.lueur.y, geos.lueur.z);
    groupe.add(lueur);
  }
  groupe.scale.setScalar(echelle);
  return { groupe, tete, yeux, lueur };
}
