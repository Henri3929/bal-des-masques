// Les secrets du château.
//
// Pour chaque secret :
//   texte    : ce qui s'écrit dans ton journal quand tu l'apprends
//   rumeur   : ce que raconte l'école si le secret devient public (par exemple via Maëlle)
//   siPublic : ce que ça change quand il devient public (même langage que « fait » dans dialogues.js)
//
// Pour modifier : change seulement le texte entre guillemets "…".

export const secrets = {
  'leo-aime-clara': {
    texte: "Léo est amoureux de Clara. Il t'a demandé de n'en parler à personne.",
    rumeur: "Toute l'école chuchote que Léo est fou de Clara. Il est rouge jusqu'aux oreilles… et il sait que tu étais au courant.",
    siPublic: "léo -3",
  },
  'sacha-aime-leo': {
    texte: "Sacha, chez les Vélandre, est amoureuse de Léo en secret.",
    rumeur: "On raconte que Sacha, la fille au chat noir, est amoureuse de Léo. Elle n'ose plus entrer dans la Grande Salle.",
    siPublic: "sacha -4",
  },
  'victor-aime-zoe': {
    texte: "Victor, le grand rival, est amoureux de Zoé.",
    rumeur: "Victor, amoureux d'une Corbeval ? Les Vélandre en rient dans son dos. Victor cherche qui a parlé.",
    siPublic: "victor -4",
  },
  'maelle-aime-hugo': {
    texte: "Maëlle est amoureuse d'Hugo depuis toujours.",
    rumeur: "Pour une fois, c'est Maëlle qui est au cœur d'une rumeur : elle aimerait Hugo. Elle ne sait plus où se mettre.",
    siPublic: "maëlle -4",
  },
  'clara-promise-victor': {
    texte: "Clara est promise à Victor par leurs familles. Elle ne l'a pas choisi.",
    rumeur: "Tout le monde sait maintenant que les familles de Clara et Victor ont arrangé leur union. Clara évite tous les regards.",
    siPublic: "clara -2",
  },
  'elsa-faux-couple': {
    texte: "Elsa veut un faux couple pour rendre Hugo jaloux.",
    rumeur: "Le plan d'Elsa est éventé : son nouveau couple n'était qu'une comédie pour rendre Hugo jaloux. L'école en rit.",
    siPublic: "elsa -4, venin +1",
  },
  'ines-traitresse': {
    texte: "C'est Inès qui vend les secrets de Corbeval à Jade.",
    rumeur: "Le nom court dans les couloirs : la traîtresse de Corbeval, c'est Inès.",
    siPublic: "inès -4",
  },
  'ines-lettre': {
    texte: "La lettre d'admission d'Inès a été falsifiée par sa mère. Jade le sait et la fait chanter.",
    rumeur: "Inès n'aurait jamais dû être admise : sa lettre était fausse. Le château entier en parle.",
    siPublic: "inès -5",
  },
  'aldane-mensonge': {
    texte: "Il y a trente ans, la professeure Aldane a menti pour faire expulser un élève à sa place.",
    rumeur: "La professeure Aldane, une menteuse ? L'histoire d'il y a trente ans refait surface.",
    siPublic: "",
  },
  'ombre-frere-zoe': {
    texte: "C'est Ombre qui a enfermé le frère de Zoé dans la réserve interdite.",
    rumeur: "On murmure qu'un élève disparu serait enfermé quelque part dans le château.",
    siPublic: "",
  },
  'invention-victor': {
    texte: "Une rumeur que tu as inventée : Victor dormirait avec une peluche.",
    rumeur: "Toute l'école raconte que Victor dort avec une peluche. Il est furieux. Il ne sait pas d'où ça vient… pas encore.",
    siPublic: "victor -2",
  },
  'hugo-triche': {
    texte: "Hugo a triché au tournoi l'an dernier.",
    rumeur: "Le capitaine de Corbeval aurait triché au tournoi ! Hugo fusille tout le monde du regard.",
    siPublic: "hugo -5",
  },
};
