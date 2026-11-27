# Le Bal des Masques (3D)

## Règles de travail
- Ce dépôt = uniquement ce jeu. Ne jamais mélanger avec un autre projet.
- Aucune création ni modification sans que j'écrive « let's go ». Avant : on discute, tu proposes.
- Je ne sais pas coder : réponses courtes, tutoiement, tutos pas à pas très simples pour tout ce que je dois faire moi-même.
- Une étape = une session. À la fin d'une étape, mets à jour « Étape en cours ».
- À la fin de chaque étape, crée toi-même la pull request : je n'ai plus qu'à toucher « Merge ».
- Modifie seulement les fichiers nécessaires. Ne lis docs/scenario-v1.md que si l'étape en a besoin.

## Concept
Jeu narratif solo en 3D, vue à la première personne, dans le château d'une école de magie. Univers original : ne reprendre aucun nom, lieu ou personnage de Harry Potter. Relations, amours, trahisons, drama. Dialogues écrits à l'avance, pas d'IA.

## Technique
- Appli web jouable sur téléphone, installable sur l'écran d'accueil, hébergée gratuitement sur GitHub Pages.
- Three.js, style low-poly, léger pour mobile.
- Contrôles tactiles : joystick sous le pouce gauche pour marcher (il apparaît là où on pose le pouce), glisser à droite pour regarder, toucher le sol pour y aller, toucher un personnage pour parler.
- Fond sonore fabriqué par le code (Web Audio), sans fichier ; bouton pour couper le son.
- Sauvegarde locale sur le téléphone, pas de serveur.
- Assets gratuits (Kenney, Quaternius) si besoin, sinon formes simples.

## Structure
- index.html : point d'entrée
- manifest.webmanifest, sw.js, icones/ : installation sur l'écran d'accueil
- moteur/ : 3D, caméra, contrôles, interface
- salles/ : un fichier par salle
- personnages/ : modèles et emplois du temps
- scenario/ : dialogues, intrigues, secrets, fins, en fichiers de données modifiables sans toucher au moteur
- docs/scenario-v1.md : scénario de référence

## Feuille de route
1. Mise en place : structure des dossiers, GitHub Pages
2. Prototype : la Grande Salle en 3D, déplacement et regard, testable sur téléphone
3. 3-4 personnages avec leur objet distinctif, et les dialogues
4. Joysticks et fond sonore
5. Branchement du scénario complet
6. Les autres salles, une par une

## Étape en cours
Étape 1 : faite. Étape 2 : faite (Grande Salle, bougies flottantes, jeu installable). Étape 3 : faite (8 personnages : Léo, Maëlle, Hugo, Zoé, Noah, Clara, Victor, Elsa ; figurants gris ; dialogues de présentation ; bouton jour/nuit provisoire). Étape 4 : faite (joystick, fond sonore jour/nuit, bouton son). Étape 5 : faite (écran de départ prénom + fille/garçon, sauvegarde, calendrier 6 semaines × 4 moments, une vraie conversation par moment, jauges cachées, journal, rumeurs, échéances des intrigues, Grimaud la nuit ; Inès, Jade, Sacha ajoutées ; semaine 1 jouable, puis « À suivre »). Étape 6 : à démarrer (salles une par une, avec Morvan, Aldane, Grimaud, Ombre et les semaines 2 à 6).
