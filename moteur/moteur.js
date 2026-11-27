// Moteur 3D : crée la scène, la caméra, et fait tourner le jeu image par image.
import * as THREE from 'three';
import { Controles } from './controles.js';
import { creerActeurs } from './acteurs.js';
import { creerFigurants } from './figurants.js';
import { Dialogue } from './dialogue.js';
import { Son } from './son.js';

export function demarrer(conteneur, construireSalle) {
  const rendu = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  rendu.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  rendu.setSize(window.innerWidth, window.innerHeight);
  rendu.toneMapping = THREE.ACESFilmicToneMapping;
  rendu.toneMappingExposure = 1.1;
  conteneur.appendChild(rendu.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 120);
  camera.rotation.order = 'YXZ';

  const salle = construireSalle(scene);
  const acteurs = creerActeurs(scene, salle.id);
  const figurants = creerFigurants(scene, salle, acteurs.placesOccupees('jour'));
  const controles = new Controles(camera, rendu.domElement, salle, scene, acteurs);
  const dialogue = new Dialogue();
  const son = new Son();

  // douce lumière sur le visage de la personne à qui l'on parle
  const lumiereVisage = new THREE.PointLight(0xfff0dc, 0, 5, 1.5);
  scene.add(lumiereVisage);

  let moment = 'jour';
  let interlocuteur = null;
  const jeu = {
    scene, camera, controles, son,
    surDialogue: null,      // prévenu quand une conversation s'ouvre ou se ferme
    get moment() { return moment; },
    get enDialogue() { return !!interlocuteur; },
    reglerMoment(m) {
      moment = m;
      controles.annulerParole();
      salle.reglerMoment?.(m);
      acteurs.reglerMoment(m);
      figurants.reglerMoment(m);
      son.reglerMoment(m);
      rendu.toneMappingExposure = m === 'jour' ? 1.2 : 1.1;
    },
  };
  jeu.reglerMoment(moment);

  controles.surParler = (acteur) => {
    interlocuteur = acteur;
    controles.enDialogue = true;
    controles.regard = acteur.s.yeux;
    controles.lacherTout();
    son.attenuer(true);
    jeu.surDialogue?.(true);
    dialogue.ouvrir(acteur.perso, moment, () => {
      interlocuteur = null;
      controles.enDialogue = false;
      controles.regard = null;
      son.attenuer(false);
      jeu.surDialogue?.(false);
    });
  };

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    rendu.setSize(window.innerWidth, window.innerHeight);
  });

  const horloge = new THREE.Clock();
  rendu.setAnimationLoop(() => {
    const dt = Math.min(horloge.getDelta(), 0.1);
    const t = horloge.elapsedTime;
    controles.mettreAJour(dt, t);
    acteurs.mettreAJour(t, dt, controles.position, interlocuteur);
    const voulue = interlocuteur ? 2.5 : 0;
    lumiereVisage.intensity += (voulue - lumiereVisage.intensity) * Math.min(1, dt * 3);
    lumiereVisage.position.copy(camera.position);
    figurants.mettreAJour(t, dt, controles.position);
    son.mettreAJour(controles.position, controles.marche);
    if (salle.animer) salle.animer(t, dt);
    rendu.render(scene, camera);
  });

  return jeu;
}
