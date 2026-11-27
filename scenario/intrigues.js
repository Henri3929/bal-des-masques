// Les intrigues : ce qui se passe dans le château, avec ou sans toi.
//
// Pour chaque intrigue :
//   titre     : son nom dans ton journal
//   resume    : ce qu'affiche le journal tant qu'elle est en cours
//   echeance  : le dernier jour pour agir (semaine et jour). Pas d'échéance = pas de limite.
//   parDefaut : ce qui arrive si tu n'as rien réglé avant l'échéance
//               texte = la scène racontée, fait = ce que ça change, journal = la ligne du journal
//   issues    : la ligne du journal selon la façon dont tu l'as réglée
//
// Dans les dialogues : « intrigue B ouvre » l'ouvre, « intrigue B aider » la règle avec l'issue « aider ».

export const intrigues = {
  A: {
    titre: 'Le traître',
    resume: "Quelqu'un à Corbeval vend les secrets de la maison aux Vélandre. Hugo veut un nom avant la fin de la semaine 4.",
    echeance: { semaine: 4, jour: 'vendredi' },
    parDefaut: {
      texte: "Hugo a fini par trouver le traître tout seul. Du moins, il le croit. Devant toute la maison, il accuse Léo. Léo jure qu'il est innocent. Personne ne l'écoute.",
      fait: "léo -2, hugo -1",
      journal: "Hugo a accusé Léo à tort. Le vrai traître court toujours.",
    },
    issues: {
      hugo: "Tu as dénoncé Inès à Hugo. Elle a été expulsée. Jade a gagné.",
      aldane: "Tu as dénoncé Inès à Aldane. Elle a été punie en silence. Hugo t'en veut de l'avoir écarté.",
      couvrir: "Tu as couvert Inès. Elle te doit tout.",
      piege: "Avec Sacha, tu as piégé Jade. Jade a été renvoyée.",
      chantage: "Tu fais chanter Inès à ton tour.",
    },
  },
  B: {
    titre: 'Léo et Clara',
    resume: "Léo est amoureux de Clara et compte sur toi pour l'aider. Les invitations au bal arrivent en semaine 5.",
    echeance: { semaine: 5, jour: 'mercredi' },
    parDefaut: {
      texte: "Léo n'a plus attendu. Il s'est déclaré à Clara, seul, au milieu du couloir. Elle a dit non. Depuis, il te regarde de travers : il est persuadé que tu y es pour quelque chose.",
      fait: "léo -3",
      journal: "Léo s'est déclaré seul. Clara a refusé. Il te soupçonne.",
    },
    issues: {
      aide: "Tu as aidé Léo sincèrement.",
      sabote: "Tu as saboté Léo en douce.",
      aveu: "Tu as avoué à Léo que Clara te plaît aussi.",
      sacha: "Tu as poussé Léo vers Sacha.",
    },
  },
  C: {
    titre: 'Le faux couple',
    resume: "Elsa cherche quelqu'un pour jouer son nouveau couple et rendre Hugo jaloux.",
    echeance: { semaine: 5, jour: 'vendredi' },
    parDefaut: {
      texte: "Elsa a trouvé quelqu'un d'autre pour son petit jeu. Hugo n'a rien vu venir.",
      fait: "",
      journal: "Elsa a mené son jeu sans toi.",
    },
    issues: {
      accepte: "Tu as accepté d'être le faux couple d'Elsa.",
      refuse: "Tu as refusé la proposition d'Elsa.",
      hugo: "Tu as révélé le plan d'Elsa à Hugo. Elsa te hait.",
      maelle: "Tu as tout dit à Maëlle. Elsa a été humiliée devant toute l'école.",
    },
  },
  D: {
    titre: 'Noah',
    resume: "Les amis de Victor harcèlent Noah. Il ne tiendra pas éternellement.",
    echeance: { semaine: 5, jour: 'vendredi' },
    parDefaut: {
      texte: "Personne n'a vraiment tendu la main à Noah. Quelque chose s'est cassé en lui. Dans la réserve de Morvan, le flacon rose a disparu.",
      fait: "note noah-bascule",
      journal: "Noah a basculé. Le filtre d'amour a disparu.",
    },
    issues: {
      public: "Tu as défendu Noah devant tout le monde. Il ne l'oubliera jamais.",
      secret: "Tu as aidé Noah en secret.",
      manipule: "Tu as fait de Noah ton exécutant.",
      ignore: "Tu as laissé Noah se débrouiller.",
    },
  },
  E: {
    titre: 'Ombre',
    resume: "Un fantôme enchaîné hante le château. Il offre ses services contre des secrets.",
    issues: {},
  },
  frere: {
    titre: 'Le frère de Zoé',
    resume: "Le frère de Zoé a disparu il y a deux ans, une nuit. Zoé ne croit pas qu'il se soit enfui.",
    issues: {
      trouve: "Tu sais ce qui est arrivé au frère de Zoé.",
    },
  },
};
