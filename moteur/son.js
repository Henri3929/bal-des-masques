// Le fond sonore, fabriqué directement par le téléphone (aucun fichier à télécharger).
// Jour : murmure des élèves et bruit des couverts. Nuit : vent. Toujours : le feu, les pas, une mélodie.
const CLE = 'bal-des-masques:son';
const CHEMINEE = { x: 7.6, z: 4 };

// gamme de ré mineur, en notes MIDI
const GAMME = [50, 52, 53, 55, 57, 58, 60, 62, 64, 65, 67, 69, 70, 72];
// accords de fond : ré mineur, si bémol, sol mineur, la
const ACCORDS = [[50, 53, 57], [46, 50, 53], [43, 46, 50], [45, 49, 52]];
const hz = (n) => 440 * Math.pow(2, (n - 69) / 12);
const hasard = (a, b) => a + Math.random() * (b - a);

function lirePref() {
  try { return localStorage.getItem(CLE) !== 'off'; } catch { return true; }
}
function ecrirePref(actif) {
  try { localStorage.setItem(CLE, actif ? 'on' : 'off'); } catch { /* rien */ }
}

export class Son {
  constructor() {
    this.ctx = null;
    this.actif = lirePref();
    this.moment = 'jour';
    document.addEventListener('visibilitychange', () => {
      if (!this.ctx) return;
      if (document.hidden) this.ctx.suspend(); else this.ctx.resume();
    });
  }

  // À appeler pendant un toucher de l'écran (les téléphones l'exigent)
  demarrer() {
    if (this.ctx) { this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = this.ctx = new AC();
    const t = ctx.currentTime;

    // bruits de base
    this.blanc = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const b = this.blanc.getChannelData(0);
    for (let i = 0; i < b.length; i++) b[i] = Math.random() * 2 - 1;
    this.brun = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const r = this.brun.getChannelData(0);
    let dernier = 0;
    for (let i = 0; i < r.length; i++) { dernier = (dernier + 0.02 * (Math.random() * 2 - 1)) / 1.02; r[i] = dernier * 3.5; }

    // volume général, écho de la grande salle
    this.maitre = this.gain(this.actif ? 1.2 : 0, ctx.destination);
    this.echo = ctx.createConvolver();
    this.echo.buffer = this.reponseSalle(3.2);
    this.echo.connect(this.gain(0.5, this.maitre));
    this.ambiance = this.gain(1, this.maitre);

    // le souffle de la salle
    this.boucle(this.brun, this.filtre('lowpass', 250, 0.7, this.gain(0.18, this.ambiance)));

    // le feu de cheminée (plus fort quand on s'approche)
    this.feu = this.gain(0.3, this.ambiance);
    this.boucle(this.brun, this.filtre('lowpass', 500, 0.7, this.gain(0.35, this.feu)), 1);
    this.prochainCrepit = t;

    // le murmure des élèves (le jour)
    this.murmure = this.gain(0, this.ambiance);
    this.murmure.connect(this.echo);
    this.voix = [380, 650, 1100, 1800].map((f, i) => {
      const g = this.gain(0, this.murmure);
      this.boucle(this.blanc, this.filtre('bandpass', f, 3, g), i * 0.4);
      return { g, base: [0.22, 0.2, 0.12, 0.05][i], prochain: t };
    });
    this.prochainCouvert = t + 1;

    // le vent (la nuit)
    this.vent = this.gain(0, this.ambiance);
    this.filtreVent = this.filtre('bandpass', 500, 1.8, this.vent);
    this.boucle(this.blanc, this.filtreVent, 0.7);
    this.prochainVent = t;

    // la musique : un fond d'accords et une petite mélodie
    this.musique = this.gain(0.9, this.maitre);
    this.musique.connect(this.echo);
    const fondNappe = this.filtre('lowpass', 700, 0.5, this.gain(0.035, this.musique));
    this.nappe = [0, 1, 2].map(() => {
      const o = ctx.createOscillator();
      o.type = 'triangle';
      o.connect(fondNappe);
      o.start();
      return o;
    });
    this.accord = 0;
    this.changerAccord(t);
    this.prochaineNote = t + 2;
    this.note = 7;
    this.notesJouees = 0;

    this.prochainPas = t;
    this.reglerMoment(this.moment);
  }

  // ---------- petites briques ----------
  gain(v, vers) {
    const g = this.ctx.createGain();
    g.gain.value = v;
    if (vers) g.connect(vers);
    return g;
  }
  filtre(type, f, q, vers) {
    const n = this.ctx.createBiquadFilter();
    n.type = type; n.frequency.value = f; n.Q.value = q;
    n.connect(vers);
    return n;
  }
  boucle(tampon, vers, depart = 0) {
    const s = this.ctx.createBufferSource();
    s.buffer = tampon; s.loop = true;
    s.connect(vers);
    s.start(0, depart);
    return s;
  }
  reponseSalle(duree) {
    const ctx = this.ctx, n = Math.floor(ctx.sampleRate * duree);
    const buf = ctx.createBuffer(2, n, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3);
    }
    return buf;
  }
  // un petit bruit très court (crépitement, pas, cliquetis)
  claquement(t, duree, type, f, volume, vers) {
    const s = this.ctx.createBufferSource();
    s.buffer = this.blanc;
    const g = this.gain(0, vers);
    g.gain.setValueAtTime(volume, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duree);
    s.connect(this.filtre(type, f, 1, g));
    s.start(t, Math.random() * 1.5, duree + 0.05);
  }
  tinter(t, f, volume, duree, vers) {
    for (const [mult, v] of [[1, 1], [2.76, 0.35]]) {
      const o = this.ctx.createOscillator();
      o.frequency.value = f * mult;
      const g = this.gain(0, vers);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(volume * v, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + duree);
      o.connect(g);
      o.start(t);
      o.stop(t + duree + 0.1);
    }
  }
  changerAccord(t) {
    const nuit = this.moment === 'nuit';
    ACCORDS[this.accord].forEach((n, i) => this.nappe[i].frequency.setTargetAtTime(hz(n - (nuit ? 12 : 0)), t, 1.5));
  }

  // ---------- commandes ----------
  reglerMoment(m) {
    this.moment = m;
    if (!this.ctx) return;
    const t = this.ctx.currentTime, jour = m === 'jour';
    this.murmure.gain.setTargetAtTime(jour ? 1 : 0, t, 1);
    this.vent.gain.setTargetAtTime(jour ? 0 : 0.25, t, 1);
    this.changerAccord(t);
  }

  // Pendant une conversation, l'ambiance baisse un peu
  attenuer(oui) {
    if (!this.ctx) return;
    this.ambiance.gain.setTargetAtTime(oui ? 0.45 : 1, this.ctx.currentTime, 0.4);
  }

  basculer() {
    this.actif = !this.actif;
    ecrirePref(this.actif);
    if (this.ctx) this.maitre.gain.setTargetAtTime(this.actif ? 1.2 : 0, this.ctx.currentTime, 0.2);
    return this.actif;
  }

  // À chaque image : on programme les petits bruits qui arrivent
  mettreAJour(position, marche) {
    const ctx = this.ctx;
    if (!ctx || ctx.state !== 'running') return;
    const t = ctx.currentTime;
    const jour = this.moment === 'jour';

    // feu : plus fort près de la cheminée
    const d = Math.hypot(position.x - CHEMINEE.x, position.z - CHEMINEE.z);
    this.feu.gain.setTargetAtTime(Math.min(1, 2.2 / (1 + d * 0.45)), t, 0.3);
    if (t >= this.prochainCrepit) {
      this.claquement(t + 0.01, hasard(0.01, 0.05), 'bandpass', hasard(1200, 4000), hasard(0.1, 0.5), this.feu);
      this.prochainCrepit = t + 0.03 + Math.pow(Math.random(), 2) * 0.4;
    }

    // murmure : chaque « voix » monte et descend au hasard
    if (jour) {
      for (const v of this.voix) {
        if (t < v.prochain) continue;
        v.g.gain.setTargetAtTime(v.base * hasard(0.2, 1), t, 0.08);
        v.prochain = t + hasard(0.1, 0.3);
      }
      if (t >= this.prochainCouvert) {
        this.tinter(t + 0.01, hasard(2200, 4200), hasard(0.01, 0.03), 0.3, this.murmure);
        this.prochainCouvert = t + hasard(0.4, 3);
      }
    } else if (t >= this.prochainVent) {
      this.filtreVent.frequency.setTargetAtTime(hasard(250, 900), t, 1.5);
      this.vent.gain.setTargetAtTime(hasard(0.08, 0.35), t, 1.5);
      this.prochainVent = t + hasard(1.5, 4);
    }

    // pas sur les dalles
    if (marche && t >= this.prochainPas) {
      this.claquement(t + 0.01, 0.09, 'lowpass', hasard(500, 800), 0.6, this.maitre);
      this.prochainPas = t + 0.36;
    }

    // mélodie : notes lentes et douces, un peu au hasard dans la gamme
    if (t >= this.prochaineNote) {
      const nuit = !jour;
      if (Math.random() < 0.8) {
        this.note = Math.max(0, Math.min(GAMME.length - 1, this.note + [-2, -1, -1, 1, 1, 2][Math.floor(Math.random() * 6)]));
        this.tinter(t + 0.02, hz(GAMME[this.note] + 12 - (nuit ? 12 : 0)), 0.05, 2.2, this.musique);
      }
      this.notesJouees++;
      if (this.notesJouees % 8 === 0) {
        this.accord = (this.accord + 1 + Math.floor(Math.random() * 2)) % ACCORDS.length;
        this.changerAccord(t);
      }
      this.prochaineNote = t + (nuit ? hasard(1.2, 2.4) : hasard(0.7, 1.4));
    }
  }
}
