// Moteur 3D : crée la scène, la caméra, et fait tourner le jeu image par image.
import * as THREE from 'three';
import { Controles } from './controles.js';

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
  const controles = new Controles(camera, rendu.domElement, salle, scene);

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
    if (salle.animer) salle.animer(t, dt);
    rendu.render(scene, camera);
  });

  return { scene, camera, controles };
}
