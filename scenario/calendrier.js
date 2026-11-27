// Le calendrier : 6 semaines de 5 jours (lundi → vendredi).
// Chaque jour : matin (cours ou scène imposée), après-midi (libre), soir (libre), nuit (sortie possible).
//
// - scenes : les scènes imposées du matin. Le nom, c'est « semaine jour », par exemple "1 lundi".
//            Elles s'écrivent comme les dialogues (debut, dit, choix, va, fait, si…).
//            « qui » : le personnage qui parle (son identifiant). Sans « qui », c'est le récit.
// - cours  : les matins sans scène imposée, une phrase tirée au hasard.
// - derniereSemaine : la dernière semaine déjà écrite. Après, le jeu affiche « À suivre ».

export const derniereSemaine = 1;

export const scenes = {

  // ---------------------------------------------------------------- LUNDI
  '1 lundi': {
    debut: {
      dit: "Le carrosse s'arrête dans la cour. Au-dessus de toi, le château découpe ses tours dans la brume du matin.",
      va: 'aldane',
    },
    aldane: {
      qui: 'Pr. Aldane',
      dit: "Bienvenue, {prenom}. Je suis la professeure Aldane, directrice de la maison Corbeval. Votre maison, désormais. Ici, on vous jugera sur ce que vous faites. Et plus encore sur ce que vous taisez.",
      choix: [
        { dis: "(Lever la tête, {fier|fière}.) Je ne vous décevrai pas.", fait: "réputation +1", va: 'fier' },
        { dis: "(Se faire {discret|discrète}.) Merci, professeure.", va: 'discret' },
      ],
    },
    fier: { qui: 'Pr. Aldane', dit: "(Un sourire bref.) Nous verrons. Les plus confiants sont souvent ceux qui tombent de plus haut.", va: 'salle' },
    discret: { qui: 'Pr. Aldane', dit: "Sage. Les murs de ce château ont la mémoire longue.", va: 'salle' },
    salle: {
      dit: "Elle te conduit à la Grande Salle. Les bougies flottent sous la voûte. À gauche, la longue table rouge de Corbeval. À droite, la table bleue des Vélandre. Tous les regards se tournent vers toi.",
      va: 'conseil',
    },
    conseil: {
      dit: "Tu as l'après-midi pour faire connaissance. Une seule vraie conversation par moment de la journée : choisis bien à qui tu parles.",
    },
  },

  // ---------------------------------------------------------------- MARDI
  '1 mardi': {
    debut: {
      dit: "Premier cours de potions, dans les cachots. Le professeur Morvan, une fiole verte pendue au cou, fait l'appel sans lever les yeux.",
      va: 'question',
    },
    question: {
      qui: 'Pr. Morvan',
      dit: "{prenom}. La nouvelle recrue. Qu'obtient-on en mélangeant de la poudre de lune et une larme de saule ?",
      choix: [
        { dis: "Une potion de sommeil, professeur.", fait: "réputation +1", va: 'juste' },
        { dis: "(Souffler la réponse à Noah, qui lève timidement la main.)", fait: "noah +1, note aide-noah-potions", va: 'noah' },
        { dis: "Un mal de tête, si c'est vous qui la préparez.", fait: "réputation +1, hugo +1, note insolent-morvan", va: 'insolent' },
      ],
    },
    juste: { qui: 'Pr. Morvan', dit: "…Exact. Ne prenez pas l'habitude d'avoir raison, c'est agaçant.", va: 'fin' },
    noah: { qui: 'Pr. Morvan', dit: "Monsieur Noah ? Une potion de sommeil. Bien. Pour une fois. (Noah te lance un regard reconnaissant.)", va: 'fin' },
    insolent: { qui: 'Pr. Morvan', dit: "(La classe éclate de rire. Morvan, non.) Je retiens votre nom, {prenom}. Croyez-moi, je le retiens.", va: 'fin' },
    fin: { dit: "La cloche sonne. Au fond de la salle, derrière Morvan, une porte fermée à clé : sa réserve personnelle." },
  },

  // ---------------------------------------------------------------- MERCREDI
  '1 mercredi': {
    debut: {
      dit: "Cours de vol dans le parc, Corbeval contre Vélandre. Victor passe en rase-mottes au-dessus de vous en riant.",
      va: 'victor',
    },
    victor: {
      qui: 'victor',
      dit: "Alors, Corbeval ? On a peur de décoller ? Remarque, quand on vole comme vous, mieux vaut rester par terre.",
      choix: [
        { dis: "(Décoller et le dépasser.)", fait: "réputation +1, victor -1, hugo +1", va: 'depasse' },
        { dis: "(L'ignorer.)", va: 'ignore' },
        { dis: "(Rire avec les Vélandre.)", fait: "victor +1, hugo -2, venin +1", va: 'rire' },
      ],
    },
    depasse: { dit: "Tu le frôles si près qu'il manque de lâcher son balai. Hugo pousse un cri de victoire. Victor, lui, ne rit plus.", va: 'fin' },
    ignore: { qui: 'victor', dit: "Même pas de répartie. Décevant.", va: 'fin' },
    rire: { dit: "Les Vélandre t'applaudissent. Côté Corbeval, le silence est glacial. Hugo note ton nom quelque part dans sa tête.", va: 'fin' },
    fin: { dit: "En redescendant, tu vois Zoé qui fixe la tour d'astronomie, comme si elle attendait quelque chose." },
  },

  // ---------------------------------------------------------------- JEUDI
  '1 jeudi': {
    debut: {
      dit: "Petit déjeuner dans la Grande Salle. Un éclat de rire. Deux amis de Victor ont arraché le bonnet vert de Noah et se le lancent par-dessus sa tête.",
      va: 'choix',
    },
    choix: {
      dit: "Noah ne dit rien. Il garde les yeux baissés. Toute la salle regarde.",
      choix: [
        { dis: "(Te lever et récupérer le bonnet devant tout le monde.)", fait: "noah +3, réputation -1, victor -2, cœur +1, note noah-defendu", va: 'defendre' },
        { dis: "(Attendre qu'ils partent, puis rendre le bonnet à Noah en douce.)", fait: "noah +1, cœur +1, note noah-aide-secret", va: 'secret' },
        { dis: "(Rire avec eux.)", fait: "noah -3, victor +1, venin +2, note noah-moque", va: 'rire' },
        { dis: "(Ne rien faire.)", fait: "noah -1, note noah-ignore", va: 'rien' },
      ],
    },
    defendre: { dit: "Tu attrapes le bonnet au vol. Un silence. Puis les amis de Victor haussent les épaules et s'éloignent. Certains Corbeval te regardent de travers : on ne défend pas « le petit Noah ». Lui te regarde comme si tu venais de lui sauver la vie.", fait: "intrigue D ouvre" },
    secret: { dit: "Plus tard, tu retrouves le bonnet sous un banc et tu le glisses dans le sac de Noah. Il ne sait pas que c'est toi. Pas encore.", fait: "intrigue D ouvre" },
    rire: { dit: "Ton rire résonne plus fort que les autres. Noah relève les yeux vers toi. Juste une seconde. Tu n'oublieras pas ce regard.", fait: "intrigue D ouvre" },
    rien: { dit: "Personne ne bouge. Toi non plus. Le bonnet finit dans un pichet de jus de citrouille.", fait: "intrigue D ouvre" },
  },

  // ---------------------------------------------------------------- VENDREDI
  '1 vendredi': {
    debut: {
      dit: "La professeure Aldane frappe son verre. La Grande Salle se tait.",
      va: 'annonce',
    },
    annonce: {
      qui: 'Pr. Aldane',
      dit: "Dans six semaines, le soir d'un mercredi, aura lieu le Bal des Masques. D'ici là, le tournoi des maisons. Et je rappelle que les couloirs sont interdits la nuit. Monsieur Grimaud veille.",
      va: 'regards',
    },
    regards: {
      dit: "Un murmure parcourt les tables. Tout le monde se demande déjà avec qui y aller. Tes yeux se posent sur…",
      choix: [
        { dis: "(Clara, et sa rose rouge.)", fait: "amour clara +1", va: 'clara' },
        { dis: "(Zoé, et sa lanterne.)", fait: "amour zoé +1", va: 'zoe' },
        { dis: "(Elsa, et sa plume blanche.)", fait: "amour elsa +1", va: 'elsa' },
        { dis: "(Léo, à côté de toi.)", fait: "amour léo +1", va: 'leo' },
      ],
    },
    clara: { dit: "Clara te regarde déjà. Elle détourne les yeux, un peu trop vite. À côté d'elle, Victor serre les poings.", va: 'fin' },
    zoe: { dit: "Zoé ne regarde personne. Elle fixe les bougies. Puis, comme si elle t'avait senti, elle t'adresse un petit signe de tête.", va: 'fin' },
    elsa: { dit: "Elsa croise ton regard et lève son verre vers toi. À la table de Corbeval, Hugo s'en aperçoit.", va: 'fin' },
    leo: { dit: "Léo ne t'a pas vu{|e}. Il regarde Clara. Il triture son écharpe sans s'en rendre compte.", va: 'fin' },
    fin: { dit: "Et quelque part dans le château, très loin, des chaînes cliquettent." },
  },
};

// Les matins sans scène imposée
export const cours = [
  "Cours de métamorphose. Ta tasse refuse obstinément de devenir une souris.",
  "Cours d'histoire de la magie. La moitié de la classe dort. L'autre moitié fait semblant.",
  "Cours de potions. Morvan rôde entre les chaudrons comme un vautour.",
  "Cours de sortilèges. Victor réussit tout du premier coup, et il veut que ça se sache.",
  "Cours d'astronomie théorique. Le professeur parle de la tour, puis se tait brusquement.",
];

// La nuit
export const nuit = {
  question: "La nuit tombe sur le château. Les autres dorment déjà. Tu pourrais te glisser hors du dortoir… mais si Grimaud te surprend, tu le paieras.",
  rester: "Rester au dortoir et dormir",
  sortir: "Sortir en douce",
  dormir: "Tu tires les rideaux de ton lit. Dehors, très loin, des chaînes cliquettent. Tu t'endors.",
  retour: "Tu regagnes le dortoir sur la pointe des pieds.",
  // chance de se faire prendre en rentrant (de 0 à 1)
  risque: 0.25,
  pris: [
    "Une lumière. Un trousseau de clés qui tinte. « Tiens, tiens… » Grimaud t'a surpris{|e}. Il note ton nom dans son carnet avec un sourire mauvais.",
    "Grimaud surgit au coin du couloir. « Encore vous ? La prochaine fois, c'est la directrice qui s'en occupe. »",
    "« Trois fois. » Grimaud fait tinter ses clés. « Trois fois, c'est la porte. »",
  ],
  // ce que ça change, chaque fois qu'on se fait prendre
  effetPris: "réputation -1",
};

export const aSuivre = "Fin de la semaine 1. La suite de l'histoire arrive bientôt ! Ta partie est sauvegardée : tu la retrouveras là où tu l'as laissée.";
