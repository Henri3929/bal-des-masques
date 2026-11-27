// Les personnages principaux : leur apparence et leur emploi du temps.
//
// Emploi du temps : pour chaque salle, où se trouve le personnage le jour et la nuit.
//   x : gauche (-) / droite (+)      z : fond de la salle (-) / grande porte (+)
//   orientation : en degrés. 0 = regarde vers la grande porte, 90 = vers la droite,
//                 -90 = vers la gauche, 180 = vers la table des professeurs.
//   pose : 'debout' ou 'assis'
// S'il n'y a pas de ligne « nuit », le personnage n'est pas là la nuit.
//
// Dans la Grande Salle : table Corbeval en x = -4 (bancs en x = -5 et -3),
// table Vélandre en x = 4 (bancs en x = 3 et 5). Pour s'asseoir, prendre z = -11.2 + n × 1.1.

export const MAISONS = {
  corbeval: { nom: 'Corbeval', couleur: 0x9b1b1f, texte: '#ec6a64' },
  velandre: { nom: 'Vélandre', couleur: 0x2350b8, texte: '#86a6ff' },
};

export const personnages = [
  {
    id: 'leo', nom: 'Léo', maison: 'corbeval', objet: 'echarpe',
    peau: 0xf0c8a8, cheveux: 0x6b4423, coiffure: 'court',
    emploi: { 'grande-salle': {
      jour: { x: -1.9, z: 11, orientation: 20, pose: 'debout' },
    } },
  },
  {
    id: 'maelle', nom: 'Maëlle', maison: 'corbeval', objet: 'lunettes',
    peau: 0xe8b48e, cheveux: 0x2a1a14, coiffure: 'long',
    emploi: { 'grande-salle': {
      jour: { x: -3, z: 4.2, orientation: -90, pose: 'assis' },
    } },
  },
  {
    id: 'hugo', nom: 'Hugo', maison: 'corbeval', objet: 'insigne', echelle: 1.06,
    peau: 0xd9a27a, cheveux: 0x1c1410, coiffure: 'court',
    emploi: { 'grande-salle': {
      jour: { x: -1.7, z: -7, orientation: 30, pose: 'debout' },
    } },
  },
  {
    id: 'zoe', nom: 'Zoé', maison: 'corbeval', objet: 'lanterne',
    peau: 0x8a5a3c, cheveux: 0x141010, coiffure: 'queue',
    emploi: { 'grande-salle': {
      jour: { x: -6.3, z: 16.6, orientation: 110, pose: 'debout' },
      nuit: { x: 0.6, z: -9, orientation: 0, pose: 'debout' },
    } },
  },
  {
    id: 'noah', nom: 'Noah', maison: 'corbeval', objet: 'bonnet', echelle: 0.95,
    peau: 0xf2d2b8, cheveux: 0xc87a3a, coiffure: 'court',
    emploi: { 'grande-salle': {
      jour: { x: -5, z: -11.2, orientation: 90, pose: 'assis' },
      nuit: { x: -3, z: 13, orientation: -90, pose: 'assis' },
    } },
  },
  {
    id: 'clara', nom: 'Clara', maison: 'velandre', objet: 'rose',
    peau: 0xf4d0b8, cheveux: 0x7a1e14, coiffure: 'long',
    emploi: { 'grande-salle': {
      jour: { x: 1.9, z: 3, orientation: -25, pose: 'debout' },
    } },
  },
  {
    id: 'victor', nom: 'Victor', maison: 'velandre', objet: 'col',
    peau: 0xf0d8c4, cheveux: 0xe6d9a8, coiffure: 'court',
    emploi: { 'grande-salle': {
      jour: { x: 3, z: -1.3, orientation: 90, pose: 'assis' },
    } },
  },
  {
    id: 'elsa', nom: 'Elsa', maison: 'velandre', objet: 'plume',
    peau: 0xe0b090, cheveux: 0x3a2418, coiffure: 'boucles',
    emploi: { 'grande-salle': {
      jour: { x: 6.2, z: 16, orientation: -70, pose: 'debout' },
    } },
  },
];

// Les figurants : tous pareils, en gris, avec un chapeau pointu.
export const FIGURANT = {
  robe: 0x5c5b63, col: 0x85848c, peau: 0xc4b2a4, chapeau: 0x4a4950, echelle: 0.93,
};
