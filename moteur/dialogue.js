// La bulle de dialogue en bas de l'écran.
// Elle montre une suite de répliques (une conversation ou une scène racontée),
// applique les effets (« fait ») et cache les choix impossibles (« si »).
import { personnages, MAISONS } from '../personnages/personnages.js';

const NARRATEUR = '#e8cf8c';

function echapper(t) {
  return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
// Ce qui est entre parenthèses (les gestes) s'affiche en italique
function miseEnForme(t) {
  return echapper(t).replace(/\(([^)]+)\)/g, '<em>($1)</em>');
}
function couleurDe(id) {
  const p = personnages.find((q) => q.id === id);
  return p ? MAISONS[p.maison]?.texte : null;
}

export class Dialogue {
  constructor() {
    this.partie = null;
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

  // o : { nom, couleur, noeuds, recit }   recit = scène racontée (fond assombri)
  ouvrir(o, quandFini) {
    this.quandFini = quandFini;
    this.noeuds = o.noeuds;
    this.nomBase = o.nom ?? '';
    this.couleurBase = o.couleur ?? NARRATEUR;
    this.fond.classList.toggle('recit', !!o.recit);
    this.ouvert = true;
    this.fond.classList.remove('cache');
    this.montrer('debut');
  }

  montrer(id) {
    let n = this.noeuds[id];
    // une réplique avec « si » : si la condition est fausse, on passe à « sinon »
    let garde = 0;
    while (n && n.si && !this.partie?.verifier(n.si) && garde++ < 20) n = this.noeuds[n.sinon];
    if (!n) { this.fermer(); return; }
    this.noeud = n;
    this.partie?.appliquer(n.fait);
    this.pret = false;

    const qui = n.qui ? personnages.find((p) => p.id === n.qui) : null;
    this.elNom.textContent = qui ? qui.nom : (n.qui ?? this.nomBase);
    this.elNom.style.color = (n.qui ? couleurDe(n.qui) : null) ?? (n.qui ? NARRATEUR : this.couleurBase);
    this.elNom.style.display = this.elNom.textContent ? '' : 'none';

    this.elTexte.innerHTML = miseEnForme(this.partie ? this.partie.texte(n.dit) : n.dit);
    this.elTexte.classList.remove('apparait');
    void this.elTexte.offsetWidth;
    this.elTexte.classList.add('apparait');
    this.elChoix.innerHTML = '';
    this.elSuite.style.visibility = 'hidden';
    const choix = (n.choix ?? []).filter((c) => !this.partie || this.partie.verifier(c.si));
    this.choixVisibles = choix;
    // petite pause pour ne pas sauter une réplique par erreur
    setTimeout(() => {
      this.pret = true;
      if (choix.length) {
        for (const c of choix) {
          const b = document.createElement('button');
          b.innerHTML = miseEnForme(this.partie ? this.partie.texte(c.dis) : c.dis);
          b.addEventListener('click', (e) => {
            e.stopPropagation();
            this.partie?.appliquer(c.fait);
            this.montrer(c.va);
          });
          this.elChoix.appendChild(b);
        }
      } else {
        this.elSuite.textContent = n.va ? '▼' : '✕';
        this.elSuite.style.visibility = 'visible';
      }
    }, 350);
  }

  avancer() {
    if (!this.ouvert || !this.pret || this.choixVisibles.length) return;
    if (this.noeud.va) this.montrer(this.noeud.va);
    else this.fermer();
  }

  fermer() {
    this.ouvert = false;
    this.fond.classList.add('cache');
    const f = this.quandFini;
    this.quandFini = null;
    f?.();
  }
}
