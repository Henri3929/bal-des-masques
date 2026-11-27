# Le Bal des Masques (3D)

## Règles de travail
- Ce dépôt = uniquement ce jeu. Ne jamais mélanger avec un autre projet.
- Aucune création ni modification sans que j'écrive « let's go ». Avant : on discute, tu proposes.
- Je ne sais pas coder : réponses courtes, tutoiement, tutos pas à pas très simples pour tout ce que je dois faire moi-même.
- Une étape = une session. À la fin d'une étape, mets à jour « Étape en cours ».
- Modifie seulement les fichiers nécessaires. Ne lis docs/scenario-v1.md que si l'étape en a besoin.

## Concept
Jeu narratif solo en 3D, vue à la première personne, dans le château d'une école de magie. Univers original : ne reprendre aucun nom, lieu ou personnage de Harry Potter. Relations, amours, trahisons, drama. Dialogues écrits à l'avance, pas d'IA.

## Technique
- Appli web jouable sur téléphone, installable sur l'écran d'accueil, hébergée gratuitement sur GitHub Pages.
- Three.js, style low-poly, léger pour mobile.
- Contrôles tactiles sans flèches à l'écran : toucher le sol pour marcher, glisser le doigt pour regarder, toucher un personnage pour parler.
- Sauvegarde locale sur le téléphone, pas de serveur.
- Assets gratuits (Kenney, Quaternius) si besoin, sinon formes simples.

## Structure
- index.html : point d'entrée
- moteur/ : 3D, caméra, contrôles, interface
- salles/ : un fichier par salle
- personnages/ : modèles et emplois du temps
- scenario/ : dialogues, intrigues, secrets, fins, en fichiers de données modifiables sans toucher au moteur
- docs/scenario-v1.md : scénario de référence

## Feuille de route
1. Mise en place : structure des dossiers, GitHub Pages
2. Prototype : la Grande Salle en 3D, déplacement et regard, testable sur téléphone
3. 3-4 personnages avec leur objet distinctif, et les dialogues
4. Branchement du scénario complet
5. Les autres salles, une par une

## Étape en cours
Étape 1 : faite (structure des dossiers et page d'accueil). Reste à activer GitHub Pages. Prochaine : étape 2.
