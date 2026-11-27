// La partie en cours : le calendrier, les jauges cachées, les secrets connus…
// Tout est sauvegardé sur le téléphone (localStorage), sans serveur.
//
// Ce fichier comprend aussi le petit langage des fichiers du scénario :
//   fait : "léo +2, cœur +1, secret sacha-aime-leo"    → ce que ça change
//   si   : "semaine >= 2, secret sacha-aime-leo"        → quand c'est possible

import { intrigues } from '../scenario/intrigues.js';

const CLE = 'bal-des-masques-partie';
export const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];
export const CRENEAUX = ['matin', 'apres-midi', 'soir', 'nuit'];
export const NOMS_CRENEAUX = { matin: 'Matin', 'apres-midi': 'Après-midi', soir: 'Soir', nuit: 'Nuit' };
const JAUGES = ['coeur', 'venin', 'reputation'];

export function norm(t) {
  return String(t).replace(/œ/gi, 'oe').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}
const majuscule = (t) => t.charAt(0).toUpperCase() + t.slice(1);
// retrouve le nom exact d'une intrigue (« b » → « B »)
const nomIntrigue = (id) => Object.keys(intrigues).find((k) => norm(k) === id) ?? id;

export function chargerPartie() {
  try {
    const t = localStorage.getItem(CLE);
    return t ? new Partie(JSON.parse(t)) : null;
  } catch { return null; }
}

export function nouvellePartie(prenom, genre) {
  return new Partie({
    version: 1, prenom, genre,
    semaine: 1, jour: 0, creneau: 0,
    coeur: 0, venin: 0, reputation: 0,
    relation: {}, amour: {}, notes: {},
    secrets: [], publics: [], vus: [],
    rumeurs: [], intrigues: {},
    prises: 0, parle: false, fin: null,
  });
}

export function effacerPartie() {
  try { localStorage.removeItem(CLE); } catch {}
}

export class Partie {
  constructor(d) { this.d = d; this.surNouveaute = null; }
  sauver() { try { localStorage.setItem(CLE, JSON.stringify(this.d)); } catch {} }

  // ---------- le temps ----------
  get creneau() { return CRENEAUX[this.d.creneau]; }
  get nomJour() { return JOURS[this.d.jour]; }
  get ambiance() { return this.creneau === 'nuit' ? 'nuit' : 'jour'; }
  get instant() { return ((this.d.semaine - 1) * 5 + this.d.jour) * 4 + this.d.creneau; }
  static instantDe(semaine, jour, creneau = 'nuit') {
    return ((semaine - 1) * 5 + JOURS.indexOf(norm(jour))) * 4 + CRENEAUX.indexOf(creneau);
  }
  get date() {
    return `Semaine ${this.d.semaine} · ${majuscule(this.nomJour)} · ${NOMS_CRENEAUX[this.creneau]}`;
  }

  // ---------- les textes ----------
  // {prenom} → ton prénom ; {un garçon|une fille} → selon que tu es un garçon ou une fille
  texte(t) {
    return String(t ?? '')
      .replace(/\{prenom\}/gi, this.d.prenom)
      .replace(/\{([^{}|]*)\|([^{}]*)\}/g, (_, g, f) => (this.d.genre === 'fille' ? f : g));
  }

  // ---------- lire une valeur ----------
  valeur(mots) {
    const [a, b] = mots;
    if (mots.length === 1) {
      if (JAUGES.includes(a)) return this.d[a];
      if (a === 'semaine') return this.d.semaine;
      if (a === 'prises') return this.d.prises;
      return this.d.relation[a] ?? 0;
    }
    if (a === 'amour') return this.d.amour[b] ?? 0;
    if (a === 'note') return Number(this.d.notes[b] ?? 0);
    return 0;
  }

  ajouter(mots, n) {
    const [a, b] = mots;
    if (mots.length === 1) {
      if (JAUGES.includes(a) || a === 'prises') this.d[a] += n;
      else this.d.relation[a] = (this.d.relation[a] ?? 0) + n;
    } else if (a === 'amour') this.d.amour[b] = (this.d.amour[b] ?? 0) + n;
    else if (a === 'note') this.d.notes[b] = Number(this.d.notes[b] ?? 0) + n;
    else console.warn('Effet inconnu :', mots.join(' '));
  }

  // ---------- « si » : vérifier une condition ----------
  verifier(si) {
    if (!si) return true;
    return String(si).split(',').every((c) => this.verifierUne(c));
  }

  verifierUne(clause) {
    let m = norm(clause).split(/\s+/).filter(Boolean);
    if (!m.length) return true;
    if (m[0] === 'pas') return !this.verifierUne(m.slice(1).join(' '));
    const op = m[m.length - 2], n = Number(m[m.length - 1]);
    if (['>=', '<=', '>', '<', '='].includes(op) && !Number.isNaN(n)) {
      const v = this.valeur(m.slice(0, -2));
      return op === '>=' ? v >= n : op === '<=' ? v <= n : op === '>' ? v > n : op === '<' ? v < n : v === n;
    }
    switch (m[0]) {
      case 'semaine': return this.d.semaine === Number(m[1]);
      case 'jour': return this.nomJour === m[1];
      case 'moment': return this.creneau === m[1] || this.ambiance === m[1];
      case 'secret': return this.d.secrets.includes(m[1]);
      case 'public': return this.d.publics.includes(m[1]);
      case 'note': return !!this.d.notes[m[1]];
      case 'vu': return this.d.vus.includes(m[1]);
      case 'intrigue': {
        const i = this.d.intrigues[nomIntrigue(m[1])];
        return (i?.etat ?? 'inconnue') === m[2] || i?.issue === m[2];
      }
      case 'fille': return this.d.genre === 'fille';
      case 'garcon': return this.d.genre === 'garcon';
    }
    console.warn('Condition inconnue :', clause);
    return false;
  }

  // ---------- « fait » : appliquer des effets ----------
  appliquer(fait) {
    if (!fait) return;
    for (const clause of String(fait).split(',')) {
      const m = norm(clause).split(/\s+/).filter(Boolean);
      if (!m.length) continue;
      const dernier = m[m.length - 1];
      if (/^[+-]\d+$/.test(dernier)) { this.ajouter(m.slice(0, -1), Number(dernier)); continue; }
      switch (m[0]) {
        case 'secret': this.apprendre(m[1]); break;
        case 'rumeur': this.lancerRumeur(m[1]); break;
        case 'note': this.d.notes[m[1]] = true; break;
        case 'immunite': this.d.notes.immunite = this.instant + 20; break; // une semaine
        case 'intrigue': this.intrigue(m[1], m[2]); break;
        case 'fin': this.d.fin = m[1]; break;
        default: console.warn('Effet inconnu :', clause);
      }
    }
  }

  apprendre(id) {
    if (this.d.secrets.includes(id)) return;
    this.d.secrets.push(id);
    this.surNouveaute?.('secret', id);
  }

  // Ce que tu confies à Maëlle devient public deux jours plus tard
  lancerRumeur(id) {
    if (this.d.publics.includes(id) || this.d.rumeurs.some((r) => r.secret === id)) return;
    this.d.rumeurs.push({ secret: id, quand: this.instant + 8 });
  }

  // « intrigue B ouvre » l'ouvre ; « intrigue B aider » la termine avec l'issue « aider »
  intrigue(id, quoi = 'ouvre') {
    id = nomIntrigue(id);
    const i = this.d.intrigues[id] ?? (this.d.intrigues[id] = { etat: 'inconnue' });
    if (quoi === 'ouvre') {
      if (i.etat === 'inconnue') { i.etat = 'ouverte'; this.surNouveaute?.('intrigue', id); }
    } else {
      i.etat = 'resolue';
      i.issue = quoi;
    }
  }

  // ---------- avancer dans le temps ----------
  creneauSuivant() {
    this.d.creneau++;
    if (this.d.creneau > 3) {
      this.d.creneau = 0;
      this.d.jour++;
      if (this.d.jour > 4) { this.d.jour = 0; this.d.semaine++; }
    }
    this.d.parle = false;
  }
  allerAuMatin() {
    this.d.creneau = 3;
    this.creneauSuivant();
  }
}
