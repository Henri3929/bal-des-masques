// La Grande Salle : longue salle en pierre, la nuit.
// Deux grandes tables (Corbeval en rouge, Vélandre en bleu), l'estrade des professeurs,
// une cheminée, de hautes fenêtres au clair de lune et des bougies qui flottent.
import * as THREE from 'three';

const LARGEUR = 18;   // x de -9 à 9
const LONGUEUR = 44;  // z de -22 à 22
const HAUT_MURS = 11;
const FAITE = 16;     // sommet du toit

const ROUGE = 0x8e1f24;  // Corbeval
const BLEU = 0x1f3f8e;   // Vélandre
const OR = 0xc9a24a;

// ---------- petites aides ----------
function texture(dessin, taille = 256) {
  const c = document.createElement('canvas');
  c.width = c.height = taille;
  dessin(c.getContext('2d'), taille);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}
function repete(t, rx, ry) {
  const c = t.clone();
  c.repeat.set(rx, ry);
  c.needsUpdate = true;
  return c;
}
function hasard(graine) {
  let s = graine;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
function boite(l, h, p, materiau, x, y, z, parent) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(l, h, p), materiau);
  m.position.set(x, y, z);
  parent.add(m);
  return m;
}
function arche(l, h) {
  const s = new THREE.Shape();
  s.moveTo(-l / 2, 0);
  s.lineTo(l / 2, 0);
  s.lineTo(l / 2, h - l / 2);
  s.absarc(0, h - l / 2, l / 2, 0, Math.PI, false);
  s.lineTo(-l / 2, 0);
  return s;
}

// ---------- textures dessinées ----------
const alea = hasard(42);
const texDalles = texture((g, n) => {
  const k = 8, d = n / k;
  for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) {
    const v = 70 + alea() * 30;
    g.fillStyle = `rgb(${v + 8},${v + 2},${v - 6})`;
    g.fillRect(i * d, j * d, d, d);
  }
  g.strokeStyle = 'rgba(20,15,10,0.9)';
  g.lineWidth = 3;
  for (let i = 0; i <= k; i++) {
    g.beginPath(); g.moveTo(i * d, 0); g.lineTo(i * d, n); g.stroke();
    g.beginPath(); g.moveTo(0, i * d); g.lineTo(n, i * d); g.stroke();
  }
}, 512);
const texPierre = texture((g, n) => {
  const rangs = 4, cols = 2, h = n / rangs, l = n / cols;
  g.fillStyle = '#2a2420'; g.fillRect(0, 0, n, n);
  for (let r = 0; r < rangs; r++) {
    const dec = (r % 2) * l / 2;
    for (let c = -1; c <= cols; c++) {
      const v = 95 + alea() * 35;
      g.fillStyle = `rgb(${v},${v - 6},${v - 14})`;
      g.fillRect(c * l + dec + 3, r * h + 3, l - 6, h - 6);
    }
  }
});
const texBois = texture((g, n) => {
  g.fillStyle = '#5a3a22'; g.fillRect(0, 0, n, n);
  for (let i = 0; i < 40; i++) {
    g.strokeStyle = `rgba(30,18,8,${0.15 + alea() * 0.25})`;
    g.lineWidth = 1 + alea() * 3;
    const y = alea() * n;
    g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(n / 3, y + 6, n * 2 / 3, y - 6, n, y); g.stroke();
  }
});
// La grande tapisserie au masque, derrière la table des professeurs
const texTapisserie = (() => {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = '#4a0f2a'; g.fillRect(0, 0, 256, 512);
  g.strokeStyle = '#c9a24a'; g.lineWidth = 10; g.strokeRect(14, 14, 228, 484);
  g.lineWidth = 3; g.strokeRect(28, 28, 200, 456);
  // le masque
  g.save(); g.translate(128, 230);
  g.fillStyle = '#e8d6a8';
  g.beginPath();
  g.moveTo(-95, -20);
  g.bezierCurveTo(-80, -60, -20, -50, 0, -30);
  g.bezierCurveTo(20, -50, 80, -60, 95, -20);
  g.bezierCurveTo(90, 30, 40, 50, 0, 25);
  g.bezierCurveTo(-40, 50, -90, 30, -95, -20);
  g.fill();
  g.fillStyle = '#4a0f2a';
  g.beginPath(); g.ellipse(-42, -8, 24, 13, -0.2, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.ellipse(42, -8, 24, 13, 0.2, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#c9a24a'; g.lineWidth = 4;
  g.beginPath(); g.moveTo(-95, -20); g.quadraticCurveTo(-140, -90, -110, -150); g.stroke();
  g.beginPath(); g.moveTo(95, -20); g.quadraticCurveTo(140, -90, 110, -150); g.stroke();
  g.restore();
  g.fillStyle = '#c9a24a';
  g.font = 'bold 26px Georgia, serif';
  g.textAlign = 'center';
  g.fillText('SOUS LE MASQUE,', 128, 380);
  g.fillText('LA VÉRITÉ', 128, 415);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
})();

// ---------- matériaux ----------
const M = {
  dalles: new THREE.MeshLambertMaterial({ map: repete(texDalles, LARGEUR / 8, LONGUEUR / 8) }),
  pierreLong: new THREE.MeshLambertMaterial({ map: repete(texPierre, LONGUEUR / 2, HAUT_MURS / 2) }),
  pierreBout: new THREE.MeshLambertMaterial({ map: repete(texPierre, LARGEUR / 2, HAUT_MURS / 2) }),
  pierrePignon: new THREE.MeshLambertMaterial({ map: repete(texPierre, 0.5, 0.5), side: THREE.DoubleSide }),
  pierre: new THREE.MeshLambertMaterial({ color: 0x6e6258 }),
  pierreSombre: new THREE.MeshLambertMaterial({ color: 0x3a332e }),
  bois: new THREE.MeshLambertMaterial({ map: texBois }),
  boisSombre: new THREE.MeshLambertMaterial({ color: 0x2e1d12 }),
  toit: new THREE.MeshLambertMaterial({ color: 0x24170f, side: THREE.DoubleSide }),
  fer: new THREE.MeshLambertMaterial({ color: 0x1c1c1f }),
  noir: new THREE.MeshBasicMaterial({ color: 0x050302 }),
  vitre: new THREE.MeshBasicMaterial({ color: 0x2e4880 }),
  rouge: new THREE.MeshLambertMaterial({ color: ROUGE }),
  bleu: new THREE.MeshLambertMaterial({ color: BLEU }),
  or: new THREE.MeshLambertMaterial({ color: OR, emissive: 0x2a1a00 }),
  assiette: new THREE.MeshLambertMaterial({ color: 0xd8d2c4 }),
  cire: new THREE.MeshLambertMaterial({ color: 0xf2e6c8, emissive: 0x3a2a10 }),
  flamme: new THREE.MeshBasicMaterial({ color: 0xffc860 }),
  feu1: new THREE.MeshBasicMaterial({ color: 0xff7a1a }),
  feu2: new THREE.MeshBasicMaterial({ color: 0xffd24a }),
  tapisserie: new THREE.MeshLambertMaterial({ map: texTapisserie }),
  rayon: new THREE.MeshBasicMaterial({
    color: 0x7f9cff, transparent: true, opacity: 0.05, side: THREE.DoubleSide,
    depthWrite: false, blending: THREE.AdditiveBlending,
  }),
};

// Halo doux autour des flammes
const texHalo = (() => {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const d = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  d.addColorStop(0, 'rgba(255,220,150,1)');
  d.addColorStop(0.3, 'rgba(255,170,80,0.35)');
  d.addColorStop(1, 'rgba(255,140,40,0)');
  g.fillStyle = d; g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
})();

// =====================================================================
export function construireGrandeSalle(scene) {
  const salle = new THREE.Group();
  scene.add(salle);
  scene.background = new THREE.Color(0x07060c);
  scene.fog = new THREE.Fog(0x0b0a14, 18, 60);

  const cliquables = [];
  const obstacles = [];
  const animations = [];

  // ---------- lumières ----------
  scene.add(new THREE.HemisphereLight(0x4a5080, 0x2a1a10, 1.0));
  const lune = new THREE.DirectionalLight(0x9ab0ff, 0.8);
  lune.position.set(-10, 12, 4);
  scene.add(lune);
  for (const z of [-12, 2, 15]) {
    const l = new THREE.PointLight(0xffb060, 45, 26, 1.4);
    l.position.set(0, 7, z);
    scene.add(l);
  }

  // ---------- sol, estrade, marche ----------
  const sol = new THREE.Mesh(new THREE.PlaneGeometry(LARGEUR, LONGUEUR).rotateX(-Math.PI / 2), M.dalles);
  salle.add(sol);
  cliquables.push(sol);
  const estrade = boite(LARGEUR, 0.6, 6.5, M.pierre, 0, 0.3, -18.75, salle);
  const marche = boite(LARGEUR, 0.3, 0.5, M.pierre, 0, 0.15, -15.25, salle);
  cliquables.push(estrade, marche);
  // tapis rouge et bleu sur l'estrade
  boite(14, 0.02, 4, M.rouge, 0, 0.61, -19, salle);

  // ---------- murs ----------
  for (const cote of [-1, 1]) {
    const mur = boite(0.6, HAUT_MURS, LONGUEUR + 1.2, M.pierreLong, cote * (LARGEUR / 2 + 0.3), HAUT_MURS / 2, 0, salle);
    cliquables.push(mur);
  }
  for (const bout of [-1, 1]) {
    const mur = boite(LARGEUR + 1.2, HAUT_MURS, 0.6, M.pierreBout, 0, HAUT_MURS / 2, bout * (LONGUEUR / 2 + 0.3), salle);
    cliquables.push(mur);
    const pignon = new THREE.Shape();
    pignon.moveTo(-LARGEUR / 2 - 0.6, 0); pignon.lineTo(LARGEUR / 2 + 0.6, 0); pignon.lineTo(0, FAITE - HAUT_MURS + 0.4);
    const p = new THREE.Mesh(new THREE.ShapeGeometry(pignon), M.pierrePignon);
    p.position.set(0, HAUT_MURS, bout * LONGUEUR / 2);
    salle.add(p);
  }
  // corniche en haut des murs
  for (const cote of [-1, 1]) boite(0.5, 0.4, LONGUEUR, M.pierreSombre, cote * (LARGEUR / 2 - 0.2), HAUT_MURS - 0.2, 0, salle);

  // ---------- toit et charpente ----------
  const pente = Math.hypot(LARGEUR / 2, FAITE - HAUT_MURS);
  const angle = Math.atan2(LARGEUR / 2, FAITE - HAUT_MURS);
  for (const cote of [-1, 1]) {
    const pan = new THREE.Mesh(new THREE.PlaneGeometry(LONGUEUR, pente).rotateY(Math.PI / 2), M.toit);
    pan.position.set(cote * LARGEUR / 4, (HAUT_MURS + FAITE) / 2, 0);
    pan.rotation.z = -cote * angle;
    salle.add(pan);
  }
  const gTirant = new THREE.BoxGeometry(LARGEUR, 0.4, 0.4);
  const gPoincon = new THREE.BoxGeometry(0.35, FAITE - HAUT_MURS, 0.35);
  const gChevron = new THREE.BoxGeometry(0.35, pente, 0.35);
  for (let z = -20; z <= 20; z += 4) {
    const tirant = new THREE.Mesh(gTirant, M.boisSombre); tirant.position.set(0, HAUT_MURS, z); salle.add(tirant);
    const poincon = new THREE.Mesh(gPoincon, M.boisSombre); poincon.position.set(0, (HAUT_MURS + FAITE) / 2, z); salle.add(poincon);
    for (const cote of [-1, 1]) {
      const ch = new THREE.Mesh(gChevron, M.boisSombre);
      ch.position.set(cote * LARGEUR / 4, (HAUT_MURS + FAITE) / 2 - 0.2, z);
      ch.rotation.z = -cote * angle;
      salle.add(ch);
    }
  }
  boite(0.4, 0.4, LONGUEUR, M.boisSombre, 0, FAITE - 0.3, 0, salle);

  // ---------- fenêtres, piliers, torches ----------
  const formeVitre = new THREE.ShapeGeometry(arche(2.4, 6), 12);
  const formeCadre = new THREE.ShapeGeometry(arche(3.0, 6.5), 12);
  const gMeneauV = new THREE.BoxGeometry(0.1, 6, 0.08);
  const gMeneauH = new THREE.BoxGeometry(2.4, 0.1, 0.08);
  function fenetre(cote, z) {
    const g = new THREE.Group();
    const cadre = new THREE.Mesh(formeCadre, M.pierreSombre); cadre.position.set(0, -0.3, -0.01); g.add(cadre);
    g.add(new THREE.Mesh(formeVitre, M.vitre));
    const mv = new THREE.Mesh(gMeneauV, M.fer); mv.position.set(0, 3, 0.02); g.add(mv);
    for (const y of [1.6, 3.2]) { const mh = new THREE.Mesh(gMeneauH, M.fer); mh.position.set(0, y, 0.02); g.add(mh); }
    g.position.set(cote * (LARGEUR / 2 - 0.02), 3.5, z);
    g.rotation.y = -cote * Math.PI / 2;
    salle.add(g);
    if (cote < 0) {
      // rayon de lune qui tombe sur le sol
      const longueur = Math.hypot(7, 6.5);
      const r = new THREE.Mesh(new THREE.PlaneGeometry(longueur, 2.2).rotateX(Math.PI / 2), M.rayon);
      r.position.set(-LARGEUR / 2 + 3.5, 3.4, z);
      r.rotation.z = Math.atan2(-6.5, 7);
      salle.add(r);
    }
  }
  for (const z of [-14, -8, -2, 4, 10, 16]) fenetre(-1, z);
  for (const z of [-14, -8, -2, 10, 16]) fenetre(1, z);

  const flammesTorches = [];
  for (const cote of [-1, 1]) {
    for (const z of [-17, -11, -5, 1, 7, 13, 19]) {
      if (cote > 0 && z === 1) continue;
      boite(0.5, HAUT_MURS - 0.4, 0.8, M.pierre, cote * (LARGEUR / 2 - 0.25), (HAUT_MURS - 0.4) / 2, z, salle);
      // torche
      boite(0.12, 0.5, 0.12, M.fer, cote * (LARGEUR / 2 - 0.6), 3.6, z, salle);
      const f = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.35, 6), M.feu2);
      f.position.set(cote * (LARGEUR / 2 - 0.6), 4.05, z);
      salle.add(f);
      flammesTorches.push(f);
    }
  }

  // ---------- les deux longues tables ----------
  const gPied = new THREE.BoxGeometry(0.12, 0.72, 0.12);
  const gPiedBanc = new THREE.BoxGeometry(0.1, 0.42, 0.3);
  const assiettes = [], gobelets = [];
  function table(x, couleur) {
    const z0 = -12, z1 = 14, L = z1 - z0, zc = (z0 + z1) / 2;
    const dessus = boite(1.3, 0.1, L, M.bois, x, 0.77, zc, salle);
    boite(0.5, 0.012, L, couleur, x, 0.826, zc, salle); // chemin de table aux couleurs de la maison
    for (let z = z0 + 0.6; z <= z1 - 0.5; z += 4.2) {
      for (const dx of [-0.5, 0.5]) { const p = new THREE.Mesh(gPied, M.boisSombre); p.position.set(x + dx, 0.36, z); salle.add(p); }
    }
    for (const cote of [-1, 1]) {
      boite(0.4, 0.08, L, M.bois, x + cote * 1.0, 0.45, zc, salle);
      for (let z = z0 + 0.6; z <= z1 - 0.5; z += 4.2) {
        const p = new THREE.Mesh(gPiedBanc, M.boisSombre); p.position.set(x + cote * 1.0, 0.21, z); salle.add(p);
      }
      for (let z = z0 + 0.8; z < z1 - 0.5; z += 1.1) {
        assiettes.push([x + cote * 0.4, 0.83, z]);
        gobelets.push([x + cote * 0.4, 0.83, z + 0.35]);
      }
    }
    obstacles.push({ minX: x - 1.25, maxX: x + 1.25, minZ: z0, maxZ: z1 });
    cliquables.push(dessus);
    // bannière de la maison au bout de la table, accrochée à la charpente
    const banniere = boite(2.2, 4.5, 0.05, couleur, x, 8.2, z1 + 3, salle);
    boite(2.5, 0.12, 0.12, M.or, x, 10.5, z1 + 3, salle);
    banniere.rotation.y = 0;
  }
  table(-4, M.rouge);
  table(4, M.bleu);

  const gAssiette = new THREE.CylinderGeometry(0.16, 0.12, 0.03, 10).translate(0, 0.015, 0);
  const gGobelet = new THREE.CylinderGeometry(0.05, 0.03, 0.16, 7).translate(0, 0.08, 0);
  const tmp = new THREE.Object3D();
  function instances(geo, mat, liste) {
    const im = new THREE.InstancedMesh(geo, mat, liste.length);
    liste.forEach((p, i) => { tmp.position.set(...p); tmp.updateMatrix(); im.setMatrixAt(i, tmp.matrix); });
    salle.add(im);
  }
  instances(gAssiette, M.assiette, assiettes);
  instances(gGobelet, M.or, gobelets);

  // ---------- la table des professeurs sur l'estrade ----------
  const hE = 0.6;
  const tableProfs = boite(12, 0.1, 1.3, M.bois, 0, hE + 0.77, -19.5, salle);
  boite(12, 0.6, 0.04, M.rouge, 0, hE + 0.45, -18.84, salle); // nappe sur le devant
  boite(12, 0.06, 0.06, M.or, 0, hE + 0.74, -18.82, salle);
  for (const x of [-5.6, 5.6]) boite(0.15, 0.72, 1.1, M.boisSombre, x, hE + 0.36, -19.5, salle);
  for (let i = -4; i <= 4; i++) {
    const grand = i === 0;
    const h = grand ? 2.6 : 1.6;
    boite(0.6, 0.08, 0.6, M.boisSombre, i * 1.3, hE + 0.48, -20.6, salle);
    boite(0.6, h, 0.1, grand ? M.rouge : M.boisSombre, i * 1.3, hE + 0.48 + h / 2, -20.9, salle);
    if (grand) boite(0.8, 0.12, 0.14, M.or, 0, hE + 0.48 + h, -20.9, salle);
  }
  obstacles.push({ minX: -6.2, maxX: 6.2, minZ: -21.4, maxZ: -18.8 });
  cliquables.push(tableProfs);

  // tapisserie au masque et deux bannières sur le mur du fond
  const tap = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 7.2), M.tapisserie);
  tap.position.set(0, 6.4, -LONGUEUR / 2 + 0.02);
  salle.add(tap);
  boite(4, 0.15, 0.15, M.or, 0, 10.1, -LONGUEUR / 2 + 0.1, salle);
  for (const [x, c] of [[-5, M.rouge], [5, M.bleu]]) {
    boite(2, 5, 0.04, c, x, 6.5, -LONGUEUR / 2 + 0.05, salle);
    boite(2.3, 0.1, 0.1, M.or, x, 9.05, -LONGUEUR / 2 + 0.1, salle);
  }

  // ---------- la cheminée (mur de droite) ----------
  const xC = LARGEUR / 2, zC = 4;
  for (const dz of [-1.7, 1.7]) boite(1.4, 2.4, 1.0, M.pierre, xC - 0.7, 1.2, zC + dz, salle);
  boite(1.4, HAUT_MURS - 2.4, 4.4, M.pierre, xC - 0.7, 2.4 + (HAUT_MURS - 2.4) / 2, zC, salle);
  boite(0.6, 0.25, 4.9, M.pierreSombre, xC - 1.5, 2.5, zC, salle);    // manteau
  boite(1.2, 0.1, 4.6, M.pierreSombre, xC - 1.6, 0.05, zC, salle);    // âtre
  boite(0.1, 2.4, 2.4, M.noir, xC - 0.1, 1.2, zC, salle);              // fond noir
  boite(1.3, 0.02, 2.4, M.noir, xC - 0.7, 0.11, zC, salle);
  for (const [dz, r] of [[-0.4, 0.3], [0.35, -0.2]]) {
    const buche = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.2, 6), M.boisSombre);
    buche.rotation.set(Math.PI / 2, 0, r);
    buche.position.set(xC - 0.7, 0.24, zC + dz * 0.3);
    salle.add(buche);
  }
  const flammesFeu = [];
  for (let i = 0; i < 7; i++) {
    const grand = i % 2 === 0;
    const f = new THREE.Mesh(new THREE.ConeGeometry(grand ? 0.22 : 0.15, grand ? 0.9 : 0.6, 5), grand ? M.feu1 : M.feu2);
    f.position.set(xC - 0.7 + (alea() - 0.5) * 0.3, 0.6, zC - 0.75 + i * 0.25);
    f.userData.phase = alea() * 10;
    salle.add(f);
    flammesFeu.push(f);
  }
  const lumiereFeu = new THREE.PointLight(0xff8a30, 25, 16, 1.5);
  lumiereFeu.position.set(xC - 1.8, 1.4, zC);
  scene.add(lumiereFeu);
  obstacles.push({ minX: xC - 2.2, maxX: xC, minZ: zC - 2.45, maxZ: zC + 2.45 });

  // ---------- la grande porte (au bout de la salle) ----------
  const cadrePorte = new THREE.Mesh(new THREE.ShapeGeometry(arche(5.2, 7.4), 12), M.pierreSombre);
  cadrePorte.position.set(0, 0, LONGUEUR / 2 - 0.01); cadrePorte.rotation.y = Math.PI; salle.add(cadrePorte);
  const porte = new THREE.Mesh(new THREE.ShapeGeometry(arche(4.4, 6.8), 12), M.bois);
  porte.position.set(0, 0, LONGUEUR / 2 - 0.03); porte.rotation.y = Math.PI; salle.add(porte);
  boite(0.08, 6.8, 0.05, M.fer, 0, 3.4, LONGUEUR / 2 - 0.06, salle);
  for (const y of [1.2, 3.2, 5.0]) boite(4.4, 0.12, 0.05, M.fer, 0, y, LONGUEUR / 2 - 0.06, salle);
  for (const x of [-0.4, 0.4]) {
    const anneau = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.03, 6, 12), M.fer);
    anneau.position.set(x, 2.6, LONGUEUR / 2 - 0.1);
    salle.add(anneau);
  }

  // ---------- les bougies qui flottent ----------
  const N = 140;
  const bougies = [];
  for (let i = 0; i < N; i++) {
    bougies.push({
      x: (alea() - 0.5) * (LARGEUR - 3),
      y: 6 + alea() * 2.8,
      z: -19 + alea() * 36,
      h: 0.25 + alea() * 0.25,
      phase: alea() * Math.PI * 2,
      vitesse: 0.5 + alea() * 0.5,
    });
  }
  const imCire = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.045, 0.05, 1, 6), M.cire, N);
  const imFlamme = new THREE.InstancedMesh(new THREE.ConeGeometry(0.035, 0.11, 5), M.flamme, N);
  salle.add(imCire, imFlamme);
  const posHalos = new Float32Array(N * 3);
  const geoHalos = new THREE.BufferGeometry();
  geoHalos.setAttribute('position', new THREE.BufferAttribute(posHalos, 3));
  const halos = new THREE.Points(geoHalos, new THREE.PointsMaterial({
    map: texHalo, size: 0.9, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xffc070,
  }));
  halos.frustumCulled = false;
  salle.add(halos);

  function animerBougies(t) {
    bougies.forEach((b, i) => {
      const y = b.y + Math.sin(t * b.vitesse + b.phase) * 0.12;
      tmp.position.set(b.x, y, b.z); tmp.scale.set(1, b.h, 1); tmp.updateMatrix();
      imCire.setMatrixAt(i, tmp.matrix);
      const yf = y + b.h / 2 + 0.06;
      const s = 0.85 + Math.sin(t * 13 + b.phase * 3) * 0.15;
      tmp.position.set(b.x, yf, b.z); tmp.scale.set(1, s, 1); tmp.updateMatrix();
      imFlamme.setMatrixAt(i, tmp.matrix);
      posHalos[i * 3] = b.x; posHalos[i * 3 + 1] = yf; posHalos[i * 3 + 2] = b.z;
    });
    imCire.instanceMatrix.needsUpdate = true;
    imFlamme.instanceMatrix.needsUpdate = true;
    geoHalos.attributes.position.needsUpdate = true;
  }
  animerBougies(0);
  animations.push(animerBougies);

  animations.push((t) => {
    for (const f of flammesFeu) {
      const p = f.userData.phase;
      f.scale.set(1, 0.8 + Math.sin(t * 9 + p) * 0.2 + Math.sin(t * 23 + p) * 0.1, 1);
    }
    lumiereFeu.intensity = 25 + Math.sin(t * 11) * 3 + Math.sin(t * 27) * 2;
    flammesTorches.forEach((f, i) => f.scale.set(1, 0.85 + Math.sin(t * 12 + i) * 0.15, 1));
  });

  return {
    cliquables,
    obstacles,
    limites: { minX: -LARGEUR / 2 + 0.75, maxX: LARGEUR / 2 - 0.75, minZ: -LONGUEUR / 2 + 0.6, maxZ: LONGUEUR / 2 - 0.6 },
    depart: { x: 0, z: 19, lacet: 0 },
    hauteurSol(x, z) { return z < -15.5 ? 0.6 : z < -15 ? 0.3 : 0; },
    animer(t, dt) { for (const a of animations) a(t, dt); },
  };
}
