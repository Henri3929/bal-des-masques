// L'histoire : fait avancer le temps, choisit ce que disent les personnages,
// déclenche les scènes du matin, les rumeurs, les échéances des intrigues et Grimaud.
// Tout le contenu vient des fichiers de scenario/.
import { dialogues } from '../scenario/dialogues.js';
import { scenes, cours, nuit, derniereSemaine, aSuivre } from '../scenario/calendrier.js';
import { intrigues } from '../scenario/intrigues.js';
import { secrets } from '../scenario/secrets.js';
import { Partie } from './partie.js';

const PLUS_TARD = "(Tu sens qu'il y a autre chose à dire. Ce sera pour un autre moment : tu as déjà eu ta vraie conversation.)";
const auHasard = (liste) => liste[Math.floor(Math.random() * liste.length)];
const majuscule = (t) => t.charAt(0).toUpperCase() + t.slice(1);
const carte = (nom, dit) => ({ nom, noeuds: { debut: { dit } } });

export class Histoire {
  constructor(jeu, partie) {
    this.jeu = jeu;
    this.p = partie;
    jeu.partie = partie;
    jeu.histoire = this;
    this.surChangement = null;   // pour mettre à jour l'affichage (date, conversation possible)
    this.surFin = null;          // quand la partie se termine
  }
  get d() { return this.p.d; }
  get aSuivre() { return this.d.semaine > derniereSemaine; }

  // Une vraie conversation est-elle encore possible maintenant ?
  get conversationPossible() {
    return !this.d.parle && this.p.creneau !== 'matin' && !this.aSuivre;
  }

  demarrer() {
    if (this.d.fin) { this.surFin?.(this.d.fin); return; }
    this.installer();
    if (this.p.creneau === 'matin') this.matin();
  }

  // règle la lumière, les personnages et ramène le joueur à la porte
  installer() {
    this.jeu.reglerMoment(this.p.ambiance, this.p.creneau);
    this.jeu.replacer();
    this.p.sauver();
    this.surChangement?.();
  }

  // montre des scènes racontées l'une après l'autre
  raconter(cartes, ensuite) {
    const c = cartes.shift();
    if (!c) { ensuite?.(); return; }
    this.jeu.raconter(c, () => {
      this.p.sauver();
      this.surChangement?.();
      if (this.d.fin) { this.surFin?.(this.d.fin); return; }
      this.raconter(cartes, ensuite);
    });
  }

  // ---------------------------------------------------------------- parler à quelqu'un
  parler(perso) {
    const d = dialogues[perso.id];
    if (!d) return { noeuds: { debut: { dit: '…' } } };
    const vus = this.d.vus;
    const fini = () => {
      this.p.sauver();
      this.surChangement?.();
      if (this.d.fin) this.surFin?.(this.d.fin);
    };

    // 1. la présentation (ne compte pas)
    const cleP = `${perso.id}:presentation`;
    if (d.presentation && !vus.includes(cleP) && this.p.ambiance === 'jour') {
      vus.push(cleP);
      return { noeuds: d.presentation, quandFini: fini };
    }

    // 2. une vraie conversation, s'il en reste une pour ce moment
    const dispo = this.aSuivre ? null : (d.conversations ?? []).find(
      (c) => !vus.includes(c.id) && this.bonMoment(c.moment) && this.p.verifier(c.si));
    if (dispo && !this.d.parle) {
      vus.push(dispo.id);
      this.d.parle = true;
      return { noeuds: dispo.noeuds, quandFini: fini };
    }

    // 3. sinon, une petite phrase
    const e = d.ensuite ?? {};
    const lignes = (Array.isArray(e) ? e : e[this.p.ambiance] ?? e.jour) ?? ['…'];
    const noeuds = { debut: { dit: auHasard(lignes.length ? lignes : ['…']) } };
    if (dispo) { noeuds.debut.va = 'plustard'; noeuds.plustard = { dit: PLUS_TARD }; }
    return { noeuds, quandFini: fini };
  }

  bonMoment(m = 'jour') {
    const c = this.p.creneau;
    if (m === 'jour') return c === 'apres-midi' || c === 'soir';
    return c === m || (m === 'nuit' && c === 'nuit');
  }

  // ---------------------------------------------------------------- le temps qui passe
  // le bouton « moment suivant »
  avancer() {
    if (this.jeu.enDialogue || this.d.fin) return;
    if (this.aSuivre) { this.raconter([carte('À suivre', aSuivre)]); return; }
    switch (this.p.creneau) {
      case 'matin': this.matin(); break;
      case 'apres-midi': this.p.creneauSuivant(); this.passer(); break;
      case 'soir': this.demanderNuit(); break;
      case 'nuit': this.rentrer(); break;
    }
  }

  // après un changement de moment : rumeurs, échéances, puis on joue
  passer() {
    this.installer();
    this.raconter(this.evenements());
  }

  matin() {
    const cartes = this.evenements();
    if (this.aSuivre) {
      cartes.push(carte('À suivre', aSuivre));
      this.raconter(cartes);
      return;
    }
    const titre = `${majuscule(this.p.nomJour)} matin`;
    const scene = scenes[`${this.d.semaine} ${this.p.nomJour}`];
    if (scene && this.p.verifier(scene.si)) cartes.push({ nom: titre, noeuds: scene });
    else cartes.push(carte(titre, auHasard(cours)));
    this.raconter(cartes, () => { this.p.creneauSuivant(); this.passer(); });
  }

  demanderNuit() {
    delete this.d.notes['sortie-ce-soir'];
    const question = {
      nom: 'Soir',
      noeuds: {
        debut: {
          dit: nuit.question,
          choix: [
            { dis: nuit.rester, va: 'fin' },
            { dis: nuit.sortir, fait: 'note sortie-ce-soir', va: 'fin' },
          ],
        },
      },
    };
    this.raconter([question], () => {
      if (this.d.notes['sortie-ce-soir']) {
        delete this.d.notes['sortie-ce-soir'];
        this.p.creneauSuivant();
        this.passer();
      } else {
        this.raconter([carte('Nuit', nuit.dormir)], () => this.nouveauJour());
      }
    });
  }

  // fin de la nuit dehors : Grimaud t'attrape-t-il ?
  rentrer() {
    const protege = (this.d.notes.immunite ?? -1) > this.p.instant;
    const pris = !protege && Math.random() < nuit.risque;
    let texte = nuit.retour;
    if (pris) {
      this.d.prises++;
      this.p.appliquer(nuit.effetPris);
      texte = nuit.pris[Math.min(this.d.prises, nuit.pris.length) - 1];
      if (this.d.prises >= 3) this.d.fin = 'expulse';
    }
    this.raconter([carte(pris ? 'Grimaud' : 'Nuit', texte)], () => this.nouveauJour());
  }

  nouveauJour() {
    this.p.allerAuMatin();
    this.installer();
    this.matin();
  }

  // ce qui arrive tout seul : les rumeurs de Maëlle, les intrigues qui arrivent à échéance
  evenements() {
    const cartes = [];
    const maintenant = this.p.instant;

    for (const r of [...this.d.rumeurs]) {
      if (r.quand > maintenant) continue;
      this.d.rumeurs.splice(this.d.rumeurs.indexOf(r), 1);
      if (this.d.publics.includes(r.secret)) continue;
      this.d.publics.push(r.secret);
      const s = secrets[r.secret];
      if (!s) continue;
      this.p.appliquer(s.siPublic);
      cartes.push(carte('Rumeur', s.rumeur));
    }

    for (const [id, it] of Object.entries(intrigues)) {
      if (!it.echeance || !it.parDefaut) continue;
      const etat = this.d.intrigues[id]?.etat ?? 'inconnue';
      if (etat === 'resolue' || etat === 'echue') continue;
      if (maintenant > Partie.instantDe(it.echeance.semaine, it.echeance.jour)) {
        this.d.intrigues[id] = { etat: 'echue' };
        this.p.appliquer(it.parDefaut.fait);
        cartes.push(carte(it.titre, it.parDefaut.texte));
      }
    }
    return cartes;
  }
}
