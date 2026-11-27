// L'interface autour du jeu : la date en haut, les boutons, le journal,
// les petites notifications et l'écran de fin.
import { personnages, MAISONS } from '../personnages/personnages.js';
import { intrigues } from '../scenario/intrigues.js';
import { secrets } from '../scenario/secrets.js';
import { fins } from '../scenario/fins.js';
import { effacerPartie } from './partie.js';

const el = (id) => document.getElementById(id);

// Ce que le journal dit de ta relation avec quelqu'un (les chiffres restent cachés)
function motRelation(v) {
  if (v <= -4) return 'Hostile';
  if (v < 0) return 'Méfiant';
  if (v === 0) return 'Connaissance';
  if (v <= 2) return 'Bonne entente';
  if (v <= 5) return 'Ami';
  return 'Très proche';
}

export function brancherInterface(jeu, histoire) {
  const p = histoire.p;
  const hud = el('hud'), hudDate = el('hud-date'), hudConv = el('hud-conv');
  const bSuivant = el('suivant'), bJournal = el('ouvrir-journal'), bSon = el('son');
  const boutons = [hud, bSuivant, bJournal, bSon];

  // ---------- la date et la conversation possible ----------
  function maj() {
    hudDate.textContent = p.date;
    if (p.creneau === 'matin' || histoire.aSuivre) hudConv.textContent = '';
    else hudConv.textContent = histoire.conversationPossible ? '💬 Une vraie conversation possible' : '✓ Conversation faite';
    bSuivant.textContent = p.creneau === 'soir' ? '🌙' : p.creneau === 'nuit' ? '🛏️' : '⏭';
    bSon.textContent = jeu.son.actif ? '🔊' : '🔇';
  }
  histoire.surChangement = maj;
  jeu.surDialogue = (ouvert) => { for (const b of boutons) b.classList.toggle('cache', ouvert); };

  bSuivant.addEventListener('click', () => histoire.avancer());
  bSon.addEventListener('click', () => { jeu.son.demarrer(); jeu.son.basculer(); maj(); });

  // ---------- petites notifications ----------
  const toast = el('toast');
  const file = [];
  let occupe = false;
  function montrerToast(texte) {
    file.push(texte);
    if (occupe) return;
    const suivant = () => {
      const t = file.shift();
      if (!t) { occupe = false; return; }
      occupe = true;
      toast.textContent = t;
      toast.classList.add('visible');
      setTimeout(() => { toast.classList.remove('visible'); setTimeout(suivant, 400); }, 2600);
    };
    suivant();
  }
  p.surNouveaute = (genre, id) => {
    if (genre === 'secret') montrerToast('🔒 Nouveau secret dans ton journal');
    if (genre === 'intrigue') montrerToast(`📖 Nouvelle intrigue : ${intrigues[id]?.titre ?? id}`);
  };

  // ---------- le journal ----------
  const journal = el('journal'), contenu = el('journal-contenu');
  let onglet = 'intrigues';
  const ligne = (titre, texte, couleur) =>
    `<div class="ligne"><b${couleur ? ` style="color:${couleur}"` : ''}>${titre}</b><span>${texte}</span></div>`;

  function remplir() {
    for (const b of journal.querySelectorAll('.onglets button')) b.classList.toggle('actif', b.dataset.onglet === onglet);
    const d = p.d;
    let h = '';
    if (onglet === 'intrigues') {
      for (const [id, it] of Object.entries(intrigues)) {
        const etat = d.intrigues[id];
        if (!etat || etat.etat === 'inconnue') continue;
        let texte = it.resume;
        if (etat.etat === 'resolue') texte = it.issues?.[etat.issue] ?? 'Réglée.';
        if (etat.etat === 'echue') texte = it.parDefaut?.journal ?? 'Trop tard.';
        h += ligne(it.titre + (etat.etat === 'ouverte' ? '' : ' ✓'), texte);
      }
      h = h || '<p class="vide">Aucune intrigue pour l\'instant. Parle aux gens.</p>';
    }
    if (onglet === 'secrets') {
      for (const id of d.secrets) {
        const s = secrets[id];
        if (s) h += ligne(d.publics.includes(id) ? '📢 Tout le monde le sait' : '🔒 Secret', s.texte);
      }
      h = h || '<p class="vide">Tu ne connais encore aucun secret.</p>';
    }
    if (onglet === 'relations') {
      for (const perso of personnages) {
        if (!d.vus.includes(`${perso.id}:presentation`)) continue;
        const coeur = (d.amour[perso.id] ?? 0) >= 3 ? ' ♥' : '';
        h += ligne(perso.nom, motRelation(d.relation[perso.id] ?? 0) + coeur, MAISONS[perso.maison]?.texte);
      }
      h = h || '<p class="vide">Tu n\'as encore rencontré personne.</p>';
    }
    contenu.innerHTML = h;
  }
  for (const b of journal.querySelectorAll('.onglets button')) {
    b.addEventListener('click', () => { onglet = b.dataset.onglet; remplir(); });
  }
  bJournal.addEventListener('click', () => {
    if (jeu.enDialogue) return;
    remplir();
    journal.classList.remove('cache');
    jeu.controles.enDialogue = true;
    jeu.controles.lacherTout();
  });
  el('fermer-journal').addEventListener('click', () => {
    journal.classList.add('cache');
    jeu.controles.enDialogue = false;
  });

  // ---------- la fin ----------
  histoire.surFin = (id) => {
    const f = fins[id] ?? { titre: 'Fin', texte: '' };
    el('fin-titre').textContent = f.titre;
    el('fin-texte').textContent = p.texte(f.texte);
    for (const b of boutons) b.classList.add('cache');
    el('fin').classList.remove('cache');
  };
  el('recommencer').addEventListener('click', () => { effacerPartie(); location.reload(); });

  return {
    montrer() { for (const b of boutons) b.classList.remove('cache'); maj(); },
  };
}
