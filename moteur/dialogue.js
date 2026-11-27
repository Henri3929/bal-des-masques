// La bulle de dialogue en bas de l'écran.
// Lit les conversations dans scenario/dialogues.js.
import { dialogues } from '../scenario/dialogues.js';
import { MAISONS } from '../personnages/personnages.js';

function echapper(t) {
  return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
// Ce qui est entre parenthèses (les gestes) s'affiche en italique
function miseEnForme(t) {
  return echapper(t).replace(/\(([^)]+)\)/g, '<em>($1)</em>');
}

export class Dialogue {
  constructor() {
    this.dejaVus = new Set();     // conversations déjà faites (oubliées en rechargeant, pour l'instant)
    this.fond = document.createElement('div');
    this.fond.id = 'dialogue';
    this.fond.className = 'cache';
    this.fond.innerHTML = `
      <div class="bulle">
        <div class="nom"></div>
        <div class="texte"></div>
        <div class="choix"></div>
        <div class="suite">▼</div>
      </div>`;
    document.body.appendChild(this.fond);
    this.elNom = this.fond.querySelector('.nom');
    this.elTexte = this.fond.querySelector('.texte');
    this.elChoix = this.fond.querySelector('.choix');
    this.elSuite = this.fond.querySelector('.suite');
    this.fond.addEventListener('click', () => this.avancer());
    this.ouvert = false;
  }

  // Ouvre la conversation avec un personnage, au moment donné ('jour' ou 'nuit')
  ouvrir(perso, moment, quandFini) {
    const d = dialogues[perso.id]?.[moment] ?? dialogues[perso.id]?.jour;
    this.quandFini = quandFini;
    this.perso = perso;
    const cle = `${perso.id}:${moment}`;
    if (d && d.premiere && !this.dejaVus.has(cle)) {
      this.dejaVus.add(cle);
      this.noeuds = d.premiere;
    } else {
      const lignes = d?.ensuite?.length ? d.ensuite : ['…'];
      this.noeuds = { debut: { dit: lignes[Math.floor(Math.random() * lignes.length)] } };
    }
    const maison = MAISONS[perso.maison];
    this.elNom.textContent = perso.nom;
    this.elNom.style.color = maison?.texte ?? '#e8cf8c';
    this.ouvert = true;
    this.fond.classList.remove('cache');
    this.montrer('debut');
  }

  montrer(id) {
    const n = this.noeuds[id];
    if (!n) { this.fermer(); return; }
    this.noeud = n;
    this.pret = false;
    this.elTexte.innerHTML = miseEnForme(n.dit);
    this.elTexte.classList.remove('apparait');
    void this.elTexte.offsetWidth;
    this.elTexte.classList.add('apparait');
    this.elChoix.innerHTML = '';
    this.elSuite.style.visibility = 'hidden';
    // petite pause pour ne pas sauter une réplique par erreur
    setTimeout(() => {
      this.pret = true;
      if (n.choix) {
        for (const c of n.choix) {
          const b = document.createElement('button');
          b.innerHTML = miseEnForme(c.dis);
          b.addEventListener('click', (e) => { e.stopPropagation(); this.montrer(c.va); });
          this.elChoix.appendChild(b);
        }
      } else {
        this.elSuite.textContent = n.va ? '▼' : '✕';
        this.elSuite.style.visibility = 'visible';
      }
    }, 350);
  }

  avancer() {
    if (!this.ouvert || !this.pret || this.noeud.choix) return;
    if (this.noeud.va) this.montrer(this.noeud.va);
    else this.fermer();
  }

  fermer() {
    this.ouvert = false;
    this.fond.classList.add('cache');
    if (this.quandFini) this.quandFini();
  }
}
