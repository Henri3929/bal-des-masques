// Les dialogues des personnages.
//
// ============================== MODE D'EMPLOI ==============================
//
// Pour chaque personnage :
//   presentation  : la première rencontre (le jour). Elle ne compte pas comme une vraie conversation.
//   conversations : les vraies conversations, dans l'ordre. Une seule par moment libre
//                   (après-midi, soir, nuit), tous personnages confondus.
//                   id     : un nom unique (ex. "leo-1")
//                   moment : "jour" (après-midi ou soir), "apres-midi", "soir" ou "nuit". Par défaut : "jour".
//                   si     : quand elle devient possible (voir plus bas)
//                   noeuds : les répliques
//   ensuite       : ce qu'il dit quand il n'a rien de nouveau (une phrase au hasard), le jour et la nuit.
//
// Une réplique :
//   dit   : ce que dit le personnage. Ce qui est entre parenthèses s'affiche en italique (gestes).
//   va    : la réplique suivante. Sans « va » ni « choix », la conversation s'arrête.
//   choix : tes réponses. Chacune a « dis » (ta phrase) et « va » (la suite).
//   qui   : (facultatif) un autre personnage qui parle à ce moment-là.
//   fait  : (facultatif) ce que ça change. Sur une réplique ou sur un choix.
//   si    : (facultatif) le choix n'apparaît que si c'est vrai.
//           Sur une réplique : si c'est faux, on passe à la réplique « sinon ».
//
// « fait » — séparés par des virgules :
//   léo +2 / hugo -1         l'amitié avec ce personnage
//   amour clara +1           l'amour (Léo, Zoé, Clara, Elsa)
//   cœur +1 / venin +1 / réputation -1
//   secret sacha-aime-leo    tu apprends ce secret (liste dans secrets.js)
//   rumeur leo-aime-clara    Maëlle le répète : public dans 2 jours
//   note quelque-chose       retenir que c'est arrivé (« note x +1 » pour compter)
//   intrigue B ouvre         l'intrigue apparaît dans ton journal (liste dans intrigues.js)
//   intrigue B aide          l'intrigue est réglée, avec l'issue « aide »
//
// « si » — séparés par des virgules (tout doit être vrai) :
//   semaine 1 / semaine >= 2 / jour jeudi / moment nuit
//   léo >= 3 / amour clara >= 2 / venin >= 1 / note nuits-zoe >= 2
//   secret sacha-aime-leo / note noah-defendu / vu leo-1 / intrigue A ouverte / fille / garçon
//   pas secret sacha-aime-leo   (« pas » devant = le contraire)
//
// Dans les textes : {prenom} = ton prénom ; {beau|belle} = selon que tu es un garçon ou une fille.
// Si tu veux mettre des guillemets dans une phrase, utilise « » plutôt que ".
// ===========================================================================

export const dialogues = {

  // ======================= LÉO =======================
  leo: {
    presentation: {
      debut: {
        dit: "Te voilà enfin ! J'ai essayé de te garder une place à la table de Corbeval. Hugo l'a donnée à quelqu'un d'autre.",
        choix: [
          { dis: "Merci d'avoir essayé, Léo.", fait: "léo +1", va: "merci" },
          { dis: "Hugo fait toujours la loi ici ?", va: "hugo" },
        ],
      },
      merci: { dit: "C'est normal. Ici, on se serre les coudes. Du moins devant les Vélandre.", va: "clara" },
      hugo: { dit: "Il est capitaine. Il croit que ça lui donne le droit de décider qui respire. Laisse tomber.", va: "clara" },
      clara: {
        dit: "Dis… Tu vois la fille à la rose rouge, chez les Vélandre ? C'est Clara.",
        choix: [
          { dis: "Oui. Difficile de ne pas la voir.", va: "voir" },
          { dis: "Pourquoi ? Elle te plaît ?", va: "aveu" },
        ],
      },
      voir: { dit: "Ouais… C'est bien ça le problème. Tout le monde la voit.", va: "aveu" },
      aveu: {
        dit: "(Il baisse la voix.) Je crois que je suis amoureux d'elle. Ne le répète à personne. Surtout pas à Maëlle.",
        fait: "secret leo-aime-clara",
        choix: [
          { dis: "Promis, je garde ça pour moi.", fait: "léo +1", va: "promis" },
          { dis: "Tu devrais le lui dire.", va: "dire" },
        ],
      },
      promis: { dit: "Merci. Je savais que je pouvais compter sur toi. On en reparle, d'accord ?" },
      dire: { dit: "Le lui dire ? Elle ne sait même pas que j'existe. (Il jette un regard vers elle.) Pas encore." },
    },
    conversations: [
      {
        id: 'leo-1',
        noeuds: {
          debut: {
            dit: "J'ai réfléchi toute la nuit. Il faut que tu m'aides avec Clara. Toi, elle te parle. Moi, je bégaie dès qu'elle me regarde.",
            fait: "intrigue B ouvre",
            choix: [
              { dis: "D'accord. Je vais t'aider.", va: "aide" },
              { dis: "(Mentir.) Bien sûr… compte sur moi.", si: "amour clara >= 1", va: "mensonge" },
              { dis: "Léo… Clara me plaît aussi.", va: "aveu" },
              { dis: "Et Sacha ? Je crois qu'elle t'aime bien, elle.", si: "secret sacha-aime-leo", va: "sacha" },
            ],
          },
          aide: { dit: "Vraiment ? (Il te serre dans ses bras, un peu trop fort.) Tu es la meilleure chose qui me soit arrivée depuis la rentrée. Découvre ce qu'elle aime. Ce qu'elle pense de moi. N'importe quoi.", fait: "léo +2, note b-aide", va: "fin" },
          mensonge: { dit: "Merci. Vraiment. (Il sourit, soulagé. Il ne se doute de rien.) Je savais que je pouvais te faire confiance.", fait: "léo +1, venin +1, note b-mensonge", va: "fin" },
          aveu: { dit: "(Il recule d'un pas.) Toi aussi ? Évidemment. Évidemment que toi aussi. (Un long silence.) Merci de me l'avoir dit en face. Mais là, j'ai besoin d'air.", fait: "léo -2, cœur +1, note b-aveu", va: "finaveu" },
          sacha: { dit: "Sacha ? La fille au chat ? (Il rougit.) Elle est… gentille. Drôle, aussi. Je n'y avais jamais pensé. Tu es sûr{|e} ?", fait: "léo +1, note b-sacha", va: "fin" },
          fin: { dit: "Les invitations au bal, c'est dans quelques semaines. D'ici là, il faut qu'elle me remarque." },
          finaveu: { dit: "On en reparlera. Plus tard. Peut-être." },
        },
      },
      {
        id: 'leo-2',
        si: "vu leo-1",
        noeuds: {
          debut: {
            dit: "Tu as remarqué ? Hugo regarde tout le monde de travers depuis lundi. Il dit qu'il y a un traître chez nous.",
            choix: [
              { dis: "Un traître ? Comment ça ?", va: "traitre" },
              { dis: "Hugo voit des complots partout.", va: "complot" },
            ],
          },
          traitre: { dit: "Les Vélandre savent des choses qu'ils ne devraient pas savoir. Nos tactiques du tournoi, nos petits secrets…", va: "peur" },
          complot: { dit: "Peut-être. Mais cette fois, je crois qu'il a raison. Les Vélandre savent trop de choses sur nous.", va: "peur" },
          peur: {
            dit: "(Il baisse les yeux.) Le problème, c'est que Hugo ne m'aime pas. S'il ne trouve personne, c'est sur moi que ça tombera. Tu me défendrais, toi ?",
            choix: [
              { dis: "Toujours. Tu as ma parole.", fait: "léo +2, note promesse-leo", va: "parole" },
              { dis: "Si tu n'as rien fait, tu n'as rien à craindre.", va: "rien" },
            ],
          },
          parole: { dit: "(Il sourit enfin.) Alors je n'ai plus peur de rien. Enfin… presque. Il reste Clara." },
          rien: { dit: "Ici, ce n'est pas comme ça que ça marche. Tu verras." },
        },
      },
    ],
    ensuite: {
      jour: [
        "Tu crois qu'elle m'a regardé, tout à l'heure ?",
        "Pas un mot à Maëlle, hein.",
        "(Il triture son écharpe.) Je n'arrive pas à manger quand elle est dans la salle.",
      ],
    },
  },

  // ======================= MAËLLE =======================
  maelle: {
    presentation: {
      debut: {
        dit: "Ah ! C'est toi, la nouvelle tête dont tout le monde parle ce matin. Assieds-toi, je ne mords pas. Pas tout de suite.",
        choix: [
          { dis: "On parle de moi ? Qu'est-ce qu'on dit ?", va: "rumeur" },
          { dis: "Tu sais toujours tout, toi ?", va: "sait" },
        ],
      },
      rumeur: { dit: "Rien de méchant. Pour l'instant. Ici, une rumeur fait le tour du château en deux jours. Je suis bien placée pour le savoir : c'est souvent moi qui la lance.", va: "conseil" },
      sait: { dit: "Presque tout. Les murs ont des oreilles, et les oreilles, c'est moi.", va: "conseil" },
      conseil: {
        dit: "Un conseil gratuit : méfie-toi des Vélandre. Et surtout de Jade. Celle-là sourit trop pour être honnête.",
        choix: [
          { dis: "Et toi, tu as des secrets ?", va: "secret" },
          { dis: "Merci du conseil.", va: "fin" },
        ],
      },
      secret: { dit: "Moi ? Aucun. (Ses yeux glissent une seconde vers Hugo.) Absolument aucun. Pourquoi cette question ?", fait: "note maelle-regard-hugo", va: "fin" },
      fin: { dit: "Reviens me voir quand tu veux. Et si tu entends quelque chose d'intéressant… tu sais où me trouver." },
    },
    conversations: [
      {
        id: 'maelle-1',
        noeuds: {
          debut: {
            dit: "(Elle tapote le banc à côté d'elle.) Alors, {prenom}. Une semaine ici, presque. Tu as forcément appris quelque chose. Donnant, donnant : un secret contre un secret.",
            choix: [
              { dis: "Léo est amoureux de Clara.", si: "secret leo-aime-clara", fait: "rumeur leo-aime-clara, maëlle +2, venin +1, note trahi-leo", va: "leo" },
              { dis: "(Inventer.) Victor dort avec une peluche.", fait: "rumeur invention-victor, maëlle +1, venin +1", va: "invente" },
              { dis: "Je n'ai rien à te dire.", fait: "maëlle -1", va: "rien" },
            ],
          },
          leo: { dit: "(Ses yeux brillent.) Léo ? Et Clara ? La promise de Victor ? Oh, c'est délicieux. Ne t'inquiète pas, je serai discrète. (Elle ne le sera pas.)", va: "echange" },
          invente: { dit: "(Elle éclate de rire.) Une peluche ! Je ne sais pas si c'est vrai, mais d'ici jeudi, ce le sera.", va: "echange" },
          rien: { dit: "Dommage. Tu verras, ici, ceux qui ne disent rien finissent par être le sujet des conversations. Mais je vais quand même te dire une chose. Gratuitement.", va: "echange" },
          echange: {
            dit: "Hugo est sur les nerfs. Quelqu'un de Corbeval fait passer nos secrets aux Vélandre. Et ce quelqu'un, je ne sais pas qui c'est. Ça me rend malade.",
            fait: "note fuite-connue",
          },
        },
      },
      {
        id: 'maelle-2',
        si: "vu maelle-1",
        noeuds: {
          debut: {
            dit: "Tu as vu Hugo à l'entraînement ? Il a encore crié sur tout le monde. Il a raison, remarque : on ne gagnera pas la coupe en dormant. Il a toujours raison, en fait. Enfin, souvent.",
            choix: [
              { dis: "Tu parles beaucoup d'Hugo, Maëlle.", va: "remarque" },
              { dis: "Hugo est insupportable.", fait: "maëlle -1", va: "defense" },
            ],
          },
          remarque: { dit: "(Elle devient écarlate derrière ses lunettes roses.) Pas du tout. Je… je parle de tout le monde. C'est mon métier.", va: "aveu" },
          defense: { dit: "Il est exigeant. Ce n'est pas pareil. Il porte toute la maison sur ses épaules, tu sais.", va: "aveu" },
          aveu: {
            dit: "(Elle soupire.) Bon. Si tu dois savoir quelque chose sur moi, autant que ce soit par moi. Je l'aime. Depuis la première année. Et lui ne voit qu'Elsa.",
            fait: "secret maelle-aime-hugo",
            choix: [
              { dis: "Ton secret est en sécurité avec moi.", fait: "maëlle +2, cœur +1", va: "merci" },
              { dis: "Intéressant. Ça pourrait me servir.", fait: "maëlle -2, venin +1", va: "menace" },
            ],
          },
          merci: { dit: "Toi, tu es une drôle de personne. Quelqu'un qui garde les secrets. Ici, on n'en voit pas souvent." },
          menace: { dit: "(Elle te fixe longuement.) Tu apprends vite. Trop vite. Fais attention, {prenom} : moi aussi, j'ai de la mémoire." },
        },
      },
    ],
    ensuite: {
      jour: [
        "Alors, du nouveau ? Non ? Dommage.",
        "Chut, je compte qui parle à qui.",
        "(Elle remonte ses lunettes roses.) Tu as vu comment Elsa regarde notre table ? Intéressant…",
      ],
    },
  },

  // ======================= HUGO =======================
  hugo: {
    presentation: {
      debut: {
        dit: "Toi. Tu es à Corbeval maintenant, alors écoute bien. Ici, le capitaine, c'est moi.",
        choix: [
          { dis: "Bonjour, capitaine.", fait: "hugo +1", va: "poli" },
          { dis: "Tu te prends pour qui ?", fait: "hugo -1, réputation +1", va: "insolent" },
        ],
      },
      poli: { dit: "Bien. Au moins quelqu'un qui a des manières.", va: "regles" },
      insolent: { dit: "Pour celui qui va nous faire gagner la coupe cette année. Encore. Et ce ton-là, je ne l'oublierai pas.", va: "regles" },
      regles: {
        dit: "Trois règles. Un : on ne trahit pas la maison. Deux : on ne fraternise pas avec les Vélandre. Trois : quand je demande quelque chose, on le fait.",
        choix: [
          { dis: "Et si je ne suis pas d'accord ?", va: "desaccord" },
          { dis: "Compris.", va: "fin" },
        ],
      },
      desaccord: { dit: "Alors tu découvriras que la vie à Corbeval peut être très froide. (Il jette un regard vers Elsa, puis se détourne.)", va: "fin" },
      fin: { dit: "On se reverra à l'entraînement. Ne me déçois pas." },
    },
    conversations: [
      {
        id: 'hugo-1',
        noeuds: {
          debut: {
            dit: "Viens là. (Il t'entraîne un peu à l'écart.) Tu es {nouveau|nouvelle}. Tu n'as d'amis dans aucun camp. C'est exactement ce qu'il me faut.",
            va: "fuite",
          },
          fuite: {
            dit: "Quelqu'un de Corbeval parle aux Vélandre. Nos tactiques du tournoi, les secrets de la maison… tout se retrouve chez eux. Je veux un nom. Avant le match de la semaine 4.",
            fait: "intrigue A ouvre, note fuite-connue",
            choix: [
              { dis: "Je vais ouvrir l'œil, capitaine.", fait: "hugo +2, note a-mission", va: "accepte" },
              { dis: "Je ne suis pas ton espion.", fait: "hugo -1", va: "refuse" },
              { dis: "Et si c'était toi qui parlais trop ?", fait: "hugo -2, réputation +1", va: "insulte" },
            ],
          },
          accepte: { dit: "Bien. Commence par regarder qui traîne trop près de la table bleue. Et ne fais confiance à personne. Même pas à Léo.", va: "fin" },
          refuse: { dit: "Tu feras ce que tu veux. Mais quand je trouverai le traître, je me souviendrai de qui m'a aidé. Et de qui ne l'a pas fait.", va: "fin" },
          insulte: { dit: "(Sa mâchoire se crispe.) Répète ça une seule fois, et tu passeras le reste de l'année à nettoyer les balais.", va: "fin" },
          fin: { dit: "(Il redresse son insigne.) Cette maison, c'est tout ce que j'ai. Personne ne la salira." },
        },
      },
      {
        id: 'hugo-2',
        si: "vu hugo-1, vu elsa:presentation",
        noeuds: {
          debut: {
            dit: "Je t'ai vu{|e} parler avec Elsa. (Il essaie d'avoir l'air indifférent. Il n'y arrive pas.) Qu'est-ce qu'elle t'a dit ?",
            choix: [
              { dis: "Elle m'a parlé de toi.", fait: "hugo +1, elsa -1", va: "toi" },
              { dis: "Ça ne te regarde pas.", fait: "hugo -1", va: "regarde" },
              { dis: "Tu l'aimes encore, c'est ça ?", va: "encore" },
            ],
          },
          toi: { dit: "De moi ? (Un éclair passe dans ses yeux, puis s'éteint.) Peu importe. C'est fini, elle et moi. Fini.", va: "fin" },
          regarde: { dit: "Tout ce qui se passe à Corbeval me regarde. Mais soit. Garde tes secrets.", va: "fin" },
          encore: { dit: "(Il se fige.) Fais attention à ce que tu dis, {prenom}. (Puis, plus bas :) Personne ne doit penser ça. Personne.", fait: "note hugo-aime-elsa", va: "fin" },
          fin: { dit: "Retourne à tes affaires. Et rappelle-toi : je veux un nom." },
        },
      },
    ],
    ensuite: {
      jour: [
        "Tu n'as rien de mieux à faire que traîner ?",
        "Va réviser. Les Vélandre, eux, ne dorment jamais.",
        "(Il redresse son insigne.) Quoi encore ?",
      ],
    },
  },

  // ======================= ZOÉ =======================
  zoe: {
    presentation: {
      debut: {
        dit: "Tu me fixes depuis tout à l'heure. C'est la lanterne qui t'intrigue ?",
        choix: [
          { dis: "Pourquoi une lanterne en plein jour ?", va: "lanterne" },
          { dis: "Non. C'est toi.", fait: "amour zoé +1", va: "toi" },
        ],
      },
      lanterne: { dit: "Parce que dans ce château, il fait toujours plus sombre qu'on ne le croit.", va: "frere" },
      toi: { dit: "(Elle hausse un sourcil.) Direct. J'aime bien. Mais ne t'y habitue pas.", va: "frere" },
      frere: {
        dit: "Mon frère était à Corbeval, il y a deux ans. Un soir, il est sorti du dortoir. On ne l'a jamais revu. Les profs disent qu'il s'est enfui.",
        fait: "intrigue frere ouvre",
        choix: [
          { dis: "Tu ne les crois pas ?", va: "croire" },
          { dis: "Ça doit être terrible.", va: "terrible" },
        ],
      },
      croire: { dit: "Pas une seconde. Cette lanterne, c'était la sienne. Il ne serait jamais parti sans elle.", va: "fin" },
      terrible: { dit: "Garde ta pitié. Ce qu'il me faut, ce sont des réponses. Cette lanterne, c'était la sienne. Il ne serait jamais parti sans elle.", va: "fin" },
      fin: { dit: "Si un jour tu as le courage de te promener la nuit… viens me trouver ici." },
    },
    conversations: [
      {
        id: 'zoe-1',
        noeuds: {
          debut: {
            dit: "(Elle sort une page pliée de sa poche.) Je ne montre ça à personne. C'est la dernière page du journal de mon frère.",
            choix: [
              { dis: "Pourquoi tu me la montres, à moi ?", va: "pourquoi" },
              { dis: "Qu'est-ce qu'il a écrit ?", va: "page" },
            ],
          },
          pourquoi: { dit: "Parce que toi, tu n'étais pas là il y a deux ans. Tu ne peux pas faire partie du problème.", fait: "zoé +1", va: "page" },
          page: {
            dit: "« Il m'a parlé encore cette nuit. Il dit qu'il connaît la vérité sur ce qui s'est passé il y a trente ans. Il dit qu'il a besoin de moi. » C'est tout. Après, plus rien.",
            fait: "note page-frere",
            choix: [
              { dis: "« Il » ? Qui, il ?", va: "qui" },
              { dis: "Il y a trente ans… Qu'est-ce qui s'est passé ?", va: "trente" },
            ],
          },
          qui: { dit: "C'est toute la question. Quelqu'un qu'on ne voit que la nuit, je crois. Ceux qui font du bruit avec des chaînes, par exemple.", va: "fin" },
          trente: { dit: "Aucune idée. Les profs changent de sujet dès qu'on pose la question. Aldane la première.", va: "fin" },
          fin: {
            dit: "Si tu veux m'aider, viens la nuit. C'est la nuit que le château parle.",
            choix: [
              { dis: "Je viendrai.", fait: "zoé +1, amour zoé +1", va: "viendrai" },
              { dis: "Je ne veux pas d'ennuis avec Grimaud.", va: "ennuis" },
            ],
          },
          viendrai: { dit: "(Pour la première fois, elle sourit vraiment.) Alors à bientôt, {prenom}." },
          ennuis: { dit: "Personne n'en veut. Mais mon frère, lui, n'a pas eu le choix." },
        },
      },
      {
        id: 'zoe-nuit-1',
        moment: 'nuit',
        noeuds: {
          debut: {
            dit: "Chut ! Baisse la voix. Grimaud fait sa ronde, je l'ai entendu dans le couloir.",
            fait: "note nuits-zoe +1",
            choix: [
              { dis: "Qu'est-ce que tu fais ici en pleine nuit ?", va: "quoi" },
              { dis: "Tu m'avais dit de venir te trouver.", va: "venir" },
            ],
          },
          quoi: { dit: "La même chose que toi, j'imagine. Je n'arrive pas à dormir. Alors j'écoute.", va: "chaines" },
          venir: { dit: "Et tu l'as fait. (Un petit sourire.) Je ne pensais pas que tu oserais.", fait: "amour zoé +1", va: "chaines" },
          chaines: {
            dit: "Écoute… Tu entends ? Des chaînes. Toutes les nuits, vers minuit, ça vient d'en haut. Personne d'autre ne les entend.",
            choix: [
              { dis: "C'est peut-être un fantôme.", va: "fantome" },
              { dis: "Partons avant de nous faire prendre.", va: "partir" },
            ],
          },
          fantome: { dit: "Peut-être. Et peut-être qu'il sait où est mon frère.", fait: "intrigue E ouvre", va: "fin" },
          partir: { dit: "Vas-y si tu veux. Moi, je reste encore un peu.", fait: "zoé -1", va: "fin" },
          fin: { dit: "Une autre nuit, on ira voir d'où viennent ces bruits. Ensemble. Si tu oses." },
        },
      },
      {
        id: 'zoe-nuit-2',
        moment: 'nuit',
        si: "vu zoe-nuit-1",
        noeuds: {
          debut: {
            dit: "Tu es revenu{|e}. (Elle pose sa lanterne entre vous deux, sur le banc.) Assieds-toi. Ce soir, les chaînes se taisent. C'est presque pire.",
            fait: "note nuits-zoe +1",
            choix: [
              { dis: "Parle-moi de ton frère.", va: "frere" },
              { dis: "Parle-moi de toi, plutôt.", va: "toi" },
            ],
          },
          frere: { dit: "Il s'appelle Basile. Il riait tout le temps. Il me racontait des histoires de fantômes pour me faire peur. Et maintenant, c'est moi qui les cherche.", fait: "zoé +1", va: "moment" },
          toi: { dit: "(Elle te regarde, surprise.) Personne ne me demande jamais ça. Ici, je suis « la sœur du disparu ». C'est tout ce que je suis devenue.", fait: "amour zoé +2", va: "moment" },
          moment: {
            dit: "(La flamme de la lanterne tremble. Vous êtes très près l'un de l'autre.)",
            choix: [
              { dis: "(Lui prendre la main.)", si: "amour zoé >= 2", fait: "amour zoé +2", va: "main" },
              { dis: "On trouvera Basile. Je te le promets.", fait: "zoé +2, note promesse-zoe", va: "promesse" },
              { dis: "Il est tard. Je devrais rentrer.", va: "tard" },
            ],
          },
          main: { dit: "(Elle ne retire pas la sienne.) …Tu es bizarre, {prenom}. Mais c'est un bon bizarre. (Elle serre tes doigts, juste un peu.)", va: "fin" },
          promesse: { dit: "Ne promets pas ce que tu ne peux pas tenir. (Un silence.) Mais merci.", va: "fin" },
          tard: { dit: "Oui. Grimaud ne va pas tarder. File.", va: "fin" },
          fin: { dit: "La prochaine fois, je te montrerai quelque chose. Quelque chose que j'ai trouvé près de la tour d'astronomie." },
        },
      },
    ],
    ensuite: {
      jour: [
        "La nuit, le château dit la vérité. Le jour, il ment.",
        "Tu as réfléchi ? Pour la nuit ?",
      ],
      nuit: [
        "Pas si fort ! Tu vas nous faire repérer.",
        "(Elle lève sa lanterne vers la charpente.) Toujours ces chaînes… Tu les entends ?",
      ],
    },
  },

  // ======================= NOAH =======================
  noah: {
    presentation: {
      debut: {
        dit: "Oh… euh… salut. Tu peux t'asseoir ailleurs si tu veux. Les gens font souvent ça.",
        choix: [
          { dis: "Je préfère m'asseoir ici.", fait: "noah +1", va: "reste" },
          { dis: "Pourquoi tu es tout seul ?", va: "seul" },
        ],
      },
      reste: { dit: "Ah. D'accord. (Il pousse ses livres pour te faire de la place.) Merci.", va: "bonnet" },
      seul: { dit: "C'est plus simple. Quand je suis seul, ils ne me voient pas.", va: "bonnet" },
      bonnet: {
        dit: "Les amis de Victor… Ils m'ont pris mon bonnet ce matin. Ils l'ont jeté dans la fontaine du parc. Je l'ai récupéré, mais…",
        choix: [
          { dis: "Ils ne vont pas s'en tirer comme ça.", fait: "noah +1", va: "defendre" },
          { dis: "Ignore-les, ils finiront par se lasser.", va: "ignorer" },
        ],
      },
      defendre: { dit: "Non, ne fais rien ! Ça ne ferait qu'empirer. Mais… merci de l'avoir dit.", va: "fin" },
      ignorer: { dit: "C'est ce que je fais depuis un an. Ils ne se lassent pas.", va: "fin" },
      fin: { dit: "Je vais aller à la bibliothèque. Là-bas, personne ne me cherche." },
    },
    conversations: [
      {
        id: 'noah-1',
        si: "intrigue D ouverte",
        noeuds: {
          debut: { si: "note noah-defendu", sinon: "secret", dit: "(Il serre son bonnet contre lui.) Ce matin… personne n'avait jamais fait ça pour moi. Personne.", va: "suite" },
          secret: { si: "note noah-aide-secret", sinon: "moque", dit: "Quelqu'un a remis mon bonnet dans mon sac. (Il te regarde.) C'était toi, hein ?", va: "aveu" },
          moque: { si: "note noah-moque", sinon: "rien", dit: "(Il ne te regarde pas.) Tu as ri. Avec eux. Je pensais que toi, tu étais différent{|e}.", va: "excuse" },
          rien: { dit: "Tu étais là, ce matin. Tu as tout vu. (Il hausse les épaules.) Ce n'est pas grave. Personne ne fait jamais rien.", va: "suite" },
          aveu: {
            dit: "Pourquoi tu ne l'as pas dit ?",
            choix: [
              { dis: "Parce que ça ne regardait que toi.", fait: "noah +2", va: "suite" },
              { dis: "(Nier.) Ce n'était pas moi.", va: "suite" },
            ],
          },
          excuse: {
            dit: "(Il attend que tu dises quelque chose.)",
            choix: [
              { dis: "Je suis désolé{|e}. J'ai été lâche.", fait: "noah +2, cœur +1", va: "suite" },
              { dis: "Il faut savoir rire de soi, Noah.", fait: "noah -2, venin +1", va: "dur" },
            ],
          },
          dur: { dit: "(Sa voix tremble, mais pas de tristesse.) Un jour, c'est eux qui ne riront plus. Tu verras." },
          suite: {
            dit: "Je ne sais plus quoi faire. Je ne peux pas passer encore quatre ans comme ça.",
            choix: [
              { dis: "La prochaine fois, je serai là. Devant tout le monde.", fait: "noah +2, réputation -1, note d-public", va: "public" },
              { dis: "Je t'aiderai. Mais discrètement.", fait: "noah +1, note d-secret", va: "discret" },
              { dis: "Rends-leur la monnaie. Je te dirai comment.", fait: "noah +1, venin +2, note d-manip", va: "manip" },
              { dis: "Tu dois apprendre à te débrouiller seul.", fait: "noah -2, note d-ignore", va: "seul" },
            ],
          },
          public: { dit: "(Il te regarde longtemps, comme s'il n'y croyait pas.) D'accord. D'accord. Merci, {prenom}." },
          discret: { dit: "Discrètement, c'est déjà beaucoup. Merci." },
          manip: { dit: "(Ses yeux s'allument d'une drôle de lueur.) Comment ? Dis-moi. Je ferai ce que tu diras." },
          seul: { dit: "Seul. Oui. J'ai l'habitude." },
        },
      },
      {
        id: 'noah-nuit-1',
        moment: 'nuit',
        noeuds: {
          debut: {
            dit: "Ah ! Tu m'as fait peur… Je ne fais rien de mal. Je ne voulais pas rester au dortoir.",
            choix: [
              { dis: "Ils t'embêtent même là-bas ?", va: "dortoir" },
              { dis: "Tu veux de la compagnie ?", fait: "noah +1", va: "compagnie" },
            ],
          },
          dortoir: { dit: "Non, pas là-bas. Mais je les entends rire dans ma tête. Ici, au moins, il y a les bougies.", va: "filtre" },
          compagnie: { dit: "…Oui. Je veux bien. (Il fixe les bougies.) C'est calme, ici, la nuit.", va: "filtre" },
          filtre: {
            dit: "Tu sais… on dit que le professeur Morvan garde un filtre d'amour dans sa réserve. Un flacon rose. Avec ça, n'importe qui pourrait nous aimer.",
            fait: "note filtre-connu",
            choix: [
              { dis: "Ce ne serait pas vraiment de l'amour.", fait: "noah +1", va: "pasamour" },
              { dis: "Tu y penses sérieusement ?", va: "serieux" },
            ],
          },
          pasamour: { dit: "Je sais. Je sais bien. C'était juste… une idée.", va: "fin" },
          serieux: { dit: "Non ! Non. Bien sûr que non. Oublie ce que j'ai dit.", va: "fin" },
          fin: { dit: "Tu devrais retourner te coucher avant que Grimaud passe. Moi, je reste encore un peu." },
        },
      },
    ],
    ensuite: {
      jour: [
        "Ah, c'est toi… J'ai cru que c'était eux.",
        "Merci de venir me parler. Vraiment.",
      ],
      nuit: [
        "Les bougies ne s'éteignent jamais. Tu as remarqué ?",
        "Je ne dirai rien à personne. Promis.",
      ],
    },
  },

  // ======================= CLARA =======================
  clara: {
    presentation: {
      debut: {
        dit: "Tiens, la recrue de Corbeval. Tu sais que tu es du mauvais côté de la salle ?",
        choix: [
          { dis: "Les règles, ce n'est pas mon fort.", va: "regles" },
          { dis: "Je voulais voir de près la fameuse rose.", fait: "amour clara +1", va: "rose" },
        ],
      },
      regles: { dit: "(Elle rit.) Ça tombe bien, moi non plus. Mais ici, on fait semblant.", va: "famille" },
      rose: { dit: "Elle ne fane jamais. Un cadeau de ma mère. Sa façon de me rappeler que je dois rester parfaite.", va: "famille" },
      famille: {
        dit: "Chez les Vélandre, tout est décidé d'avance. Nos notes, nos amis… même avec qui on ira au bal.",
        choix: [
          { dis: "Et toi, avec qui voudrais-tu y aller ?", fait: "amour clara +1", va: "bal" },
          { dis: "Ça a l'air pesant.", fait: "clara +1", va: "pesant" },
        ],
      },
      bal: { dit: "(Elle te regarde un peu trop longtemps.) C'est une question dangereuse, ça. Surtout venant de toi.", va: "victor" },
      pesant: { dit: "Tu n'as pas idée. Merci de ne pas me dire que j'ai de la chance, comme tout le monde.", va: "victor" },
      victor: { dit: "Attention, Victor nous regarde. Il déteste qu'on me parle sans sa permission. Va-t'en, avant qu'il fasse une scène." },
    },
    conversations: [
      {
        id: 'clara-1',
        noeuds: {
          debut: {
            dit: "Encore toi. (Elle sourit malgré elle.) Victor est à l'entraînement. Pour une fois, on peut parler sans qu'il compte nos mots.",
            choix: [
              { dis: "Victor et toi, c'est sérieux ?", va: "victor" },
              { dis: "Tu as l'air triste, aujourd'hui.", fait: "clara +1", va: "triste" },
            ],
          },
          triste: { dit: "Ça se voit tant que ça ? (Elle effleure sa rose.) Ma mère m'a écrit. Elle me rappelle mes « devoirs ». Victor en fait partie.", va: "victor" },
          victor: {
            dit: "Nos familles nous ont promis l'un à l'autre quand on avait six ans. Je ne l'ai pas choisi. Lui non plus, d'ailleurs. Mais il fait semblant d'être content. Il est très doué pour faire semblant.",
            fait: "secret clara-promise-victor",
            choix: [
              { dis: "Tu as le droit de dire non.", fait: "clara +1, cœur +1", va: "droit" },
              { dis: "Et si quelqu'un d'autre te plaisait ?", fait: "amour clara +1", va: "autre" },
              { dis: "Léo, par exemple. Il est fou de toi.", si: "intrigue B ouverte", fait: "léo +1, note b-parle-clara", va: "leo" },
            ],
          },
          droit: { dit: "Le droit, oui. Le courage, c'est autre chose. (Elle te regarde.) Peut-être qu'il me manque juste une bonne raison.", va: "fin" },
          autre: { dit: "(Elle rougit, puis détourne les yeux.) Alors ce serait un très gros problème. Pour tout le monde. Surtout pour cette personne.", fait: "amour clara +1", va: "fin" },
          leo: { dit: "Léo ? L'écharpe rayée ? (Un sourire gentil, un peu gêné.) Il est adorable. Mais adorable, ce n'est pas… (Elle s'arrête et te regarde.) Ce n'est pas ce que je cherche.", va: "fin" },
          fin: { dit: "Il faut que j'y aille. Si quelqu'un te demande, on parlait de devoirs de potions." },
        },
      },
    ],
    ensuite: {
      jour: [
        "Encore toi ? Victor va finir par te remarquer.",
        "(Elle effleure sa rose.) Je repensais à ce que tu m'as dit.",
      ],
    },
  },

  // ======================= VICTOR =======================
  victor: {
    presentation: {
      debut: {
        dit: "Un Corbeval à notre table. Quelle audace. Tu cherches ton chemin ?",
        choix: [
          { dis: "Je viens juste dire bonjour.", va: "bonjour" },
          { dis: "Je cherchais quelqu'un d'intéressant. Pas de chance.", fait: "victor -1, réputation +1", va: "pique" },
        ],
      },
      bonjour: { dit: "Comme c'est touchant. Va le dire à ta table, ils adorent les bons sentiments.", va: "clara" },
      pique: { dit: "(Ses amis ricanent. Lui, non.) Tu as de la répartie. Profites-en tant que tu peux.", va: "clara" },
      clara: {
        dit: "J'ai remarqué que tu tournais autour de Clara. Alors je t'explique : Clara et moi, c'est arrangé depuis l'enfance.",
        fait: "secret clara-promise-victor",
        choix: [
          { dis: "Arrangé par qui ? Pas par elle.", fait: "victor -1", va: "parqui" },
          { dis: "Clara ne m'intéresse pas.", fait: "victor +1", va: "aucune" },
        ],
      },
      parqui: { dit: "Par ceux qui comptent. Ici, les sentiments, ça ne compte pas.", va: "fin" },
      aucune: { dit: "Parfait. Alors on va bien s'entendre.", va: "fin" },
      fin: { dit: "(Son regard glisse vers Zoé, au fond de la salle, puis revient sur toi, plus dur.) Retourne à ta table. Maintenant." },
    },
    conversations: [
      {
        id: 'victor-1',
        noeuds: {
          debut: {
            dit: "Toi. Approche. (Il ne lève pas les yeux de son assiette.) Je vais te faire une faveur : un conseil d'ami.",
            choix: [
              { dis: "On n'est pas amis.", fait: "victor -1", va: "amis" },
              { dis: "Je t'écoute.", va: "conseil" },
            ],
          },
          amis: { dit: "Pas encore. Mais ça pourrait venir. Ou pas. Ça dépend entièrement de toi.", va: "conseil" },
          conseil: {
            dit: "Ne te mêle pas des affaires des Vélandre. Ni de Clara, ni de Jade, ni de rien. Tu es {nouveau|nouvelle}, tu ne connais pas les règles. Ici, ceux qui se mêlent de tout disparaissent. Demande à la sœur de Basile.",
            choix: [
              { dis: "Tu parles de Zoé ? Tu la connais ?", va: "zoe" },
              { dis: "C'est une menace ?", va: "menace" },
            ],
          },
          zoe: {
            dit: "(Une fraction de seconde, son masque tombe.) Tout le monde connaît Zoé. Elle se promène avec sa lanterne comme une folle. Elle va finir par se faire du mal.",
            choix: [
              { dis: "On dirait que ça t'inquiète.", fait: "note victor-trouble", va: "inquiet" },
              { dis: "Laisse-la tranquille.", fait: "zoé +1, victor -1", va: "tranquille" },
            ],
          },
          inquiet: { dit: "(Il repose sa fourchette un peu trop fort.) Ça ne m'inquiète pas. Rien ne m'inquiète. Et cette conversation est terminée.", fait: "victor -1" },
          tranquille: { dit: "Je ne lui ai jamais rien fait. (Il le dit trop vite.) Va-t'en, maintenant." },
          menace: { dit: "Une menace ? (Il sourit enfin.) Non. Une menace, tu la reconnaîtras. Elle sera beaucoup moins polie." },
        },
      },
    ],
    ensuite: {
      jour: [
        "Encore là ? Tu dois vraiment t'ennuyer chez les Corbeval.",
        "Tu regardes quoi, comme ça ?",
      ],
    },
  },

  // ======================= ELSA =======================
  elsa: {
    presentation: {
      debut: {
        dit: "Oh, bonjour. Toi, au moins, tu n'as pas l'air d'un pantin d'Hugo.",
        choix: [
          { dis: "Tu connais bien Hugo ?", va: "hugo" },
          { dis: "Jolie plume.", fait: "amour elsa +1", va: "plume" },
        ],
      },
      hugo: { dit: "Un peu. Beaucoup. On est sortis ensemble l'an dernier. Il l'a oublié, apparemment.", va: "regard" },
      plume: { dit: "Merci. Hugo la trouvait ridicule. C'est pour ça que je la porte.", va: "regard" },
      regard: {
        dit: "(Elle jette un œil vers la table de Corbeval.) Il nous regarde ? Ne te retourne pas. Ris, comme si j'avais dit quelque chose de drôle.",
        choix: [
          { dis: "(Rire.) Comme ça ?", fait: "elsa +1", va: "rire" },
          { dis: "Je ne joue pas à ce jeu-là.", va: "refus" },
        ],
      },
      rire: { dit: "Parfait. Tu as du talent. J'aurai peut-être une proposition à te faire, un de ces jours.", va: "fin" },
      refus: { dit: "Dommage. Tu changeras peut-être d'avis. Tout le monde finit par jouer, ici.", va: "fin" },
      fin: { dit: "À bientôt. Et ne dis pas à Hugo qu'on a parlé… Ou dis-le-lui. Les deux me vont." },
    },
    conversations: [
      {
        id: 'elsa-1',
        noeuds: {
          debut: {
            dit: "Assieds-toi une minute. J'ai une question, et je veux une réponse honnête : qu'est-ce qu'on dit de moi, chez les Corbeval ?",
            choix: [
              { dis: "Qu'Hugo n'arrive pas à t'oublier.", fait: "elsa +2", va: "oublier" },
              { dis: "Rien. On ne parle pas de toi.", fait: "elsa -1", va: "rien" },
              { dis: "Pourquoi ça t'intéresse autant ?", va: "pourquoi" },
            ],
          },
          oublier: { dit: "(Un vrai sourire, cette fois. Puis elle se reprend.) Tant mieux. Qu'il souffre un peu. Il m'a quittée devant toute l'école, tu sais. Pour le tournoi. Pour sa « concentration ».", va: "plan" },
          rien: { dit: "{Menteur|Menteuse}. Ou alors c'est pire que ce que je croyais.", va: "plan" },
          pourquoi: { dit: "Parce qu'Hugo m'a quittée devant toute l'école. Pour le tournoi. Pour sa « concentration ». J'aimerais qu'il comprenne ce qu'il a perdu.", va: "plan" },
          plan: {
            dit: "(Elle te détaille de la tête aux pieds.) Tu es {nouveau|nouvelle}, pas mal du tout, et Hugo te surveille déjà. Tu serais parfait{|e}…",
            choix: [
              { dis: "Parfait{|e} pour quoi ?", va: "quoi" },
              { dis: "Je n'aime pas où ça mène.", va: "mene" },
            ],
          },
          quoi: { dit: "Pas encore. Je te le dirai la semaine prochaine. D'ici là, sois {gentil|gentille}. Et laisse Hugo te voir avec moi.", fait: "amour elsa +1, note elsa-plan" },
          mene: { dit: "Tu ne sais même pas où ça mène. C'est ça qui est amusant. On en reparle la semaine prochaine.", fait: "note elsa-plan" },
        },
      },
    ],
    ensuite: {
      jour: [
        "Il regarde encore ? Non ? Tant pis.",
        "(Elle lisse sa plume blanche.) Ma proposition arrive bientôt. Patience.",
      ],
    },
  },

  // ======================= INÈS =======================
  ines: {
    presentation: {
      debut: {
        dit: "(Elle referme son carnet noir d'un coup sec.) Oh ! Pardon, tu m'as surprise. Tu es {le nouveau|la nouvelle}, c'est ça ? Moi, c'est Inès.",
        choix: [
          { dis: "Qu'est-ce que tu écris ?", va: "carnet" },
          { dis: "Je ne voulais pas te faire peur.", fait: "inès +1", va: "peur" },
        ],
      },
      carnet: { dit: "Rien ! Des devoirs. Des listes. Je fais beaucoup de listes. (Elle glisse le carnet sous sa robe.) C'est bête, hein ?", va: "jade" },
      peur: { dit: "Ce n'est pas toi. Je suis toujours un peu nerveuse. Tout le monde le dit.", va: "jade" },
      jade: {
        dit: "(Son regard file vers la table des Vélandre. Jade, au ruban vert, lui fait un petit signe. Inès pâlit.) Excuse-moi. Je dois finir mes… listes.",
        fait: "note ines-jade-signe",
      },
    },
    conversations: [
      {
        id: 'ines-1',
        noeuds: {
          debut: {
            dit: "(Elle triture le coin de son carnet.) Je peux te demander quelque chose ? On dit qu'Hugo te parle beaucoup. Il… il t'a parlé d'une histoire de traître ?",
            choix: [
              { dis: "Oui. Il cherche un nom.", si: "intrigue A ouverte", fait: "inès +1, note ines-alertee", va: "oui" },
              { dis: "Pourquoi tu me demandes ça ?", va: "pourquoi" },
              { dis: "Non, jamais.", va: "non" },
            ],
          },
          oui: { dit: "(Elle devient blanche comme un linge.) Un nom. Bien sûr. Et… il soupçonne quelqu'un ?", va: "soupcon" },
          pourquoi: { dit: "Pour rien ! Simple curiosité. Tout le monde en parle, alors…", va: "soupcon" },
          non: { dit: "Ah. Tant mieux. Enfin, je veux dire… tant pis. Enfin, je ne sais pas ce que je veux dire.", va: "soupcon" },
          soupcon: {
            dit: "(Elle baisse la voix.) Si un jour tu avais un problème… un vrai problème, que personne ne peut régler… tu en parlerais à qui ?",
            choix: [
              { dis: "À toi, si tu veux. Tu peux me faire confiance.", fait: "inès +2, cœur +1", va: "confiance" },
              { dis: "À Hugo. C'est le capitaine.", fait: "inès -1", va: "hugo" },
              { dis: "Tu as un problème, Inès ?", va: "probleme" },
            ],
          },
          confiance: { dit: "(Ses yeux se remplissent de larmes, qu'elle chasse aussitôt.) Peut-être. Un jour. Pas maintenant. Merci, {prenom}." },
          hugo: { dit: "Hugo. Oui. Évidemment. (Elle se referme comme une huître.) Oublie ce que j'ai dit." },
          probleme: { dit: "Moi ? Non ! Non. (Elle rit, un rire qui sonne faux.) C'était une question comme ça. Pour une de mes listes." },
        },
      },
    ],
    ensuite: {
      jour: [
        "(Elle cache son carnet en te voyant arriver.) Ah, c'est toi.",
        "Tu n'as rien vu, d'accord ? Rien.",
      ],
    },
  },

  // ======================= JADE =======================
  jade: {
    presentation: {
      debut: {
        dit: "(Elle te sourit. Un très joli sourire, qui ne monte pas jusqu'aux yeux.) La recrue de Corbeval. On m'a beaucoup parlé de toi. Je suis Jade.",
        choix: [
          { dis: "En bien, j'espère.", va: "bien" },
          { dis: "Qui t'a parlé de moi ?", va: "qui" },
        ],
      },
      bien: { dit: "En intéressant. C'est mieux que bien.", va: "ines" },
      qui: { dit: "Oh, des gens. Les gens adorent me parler. Je ne sais pas pourquoi. (Elle ajuste son ruban vert.)", va: "ines" },
      ines: {
        dit: "Tu es assis{|e} près d'Inès, à ta table ? Elle est adorable, Inès. Si fragile. Il faudrait que quelqu'un veille sur elle.",
        fait: "note jade-ines",
      },
    },
    conversations: [
      {
        id: 'jade-1',
        noeuds: {
          debut: {
            dit: "Assieds-toi, {prenom}. Je ne vais pas te manger. Je voulais juste te proposer quelque chose : de l'amitié. Ici, ça vaut de l'or.",
            choix: [
              { dis: "Et qu'est-ce que ça me coûte ?", va: "cout" },
              { dis: "Merci, j'ai déjà des amis.", fait: "jade -1", va: "amis" },
            ],
          },
          cout: { dit: "Presque rien. Des petites choses. Ce qui se dit à Corbeval. Qui parle à qui. Ce qu'Inès écrit dans son carnet, par exemple.", va: "offre" },
          amis: { dit: "Tout le monde a des amis, la première semaine. On verra combien il t'en reste dans un mois. Mais écoute quand même.", va: "offre" },
          offre: {
            dit: "En échange, je te dis ce qui se passe chez les Vélandre. Ce que Clara pense vraiment. Ce que Victor cache. Donnant, donnant.",
            choix: [
              { dis: "Hugo cherche un traître à Corbeval.", si: "intrigue A ouverte", fait: "jade +2, venin +2, hugo -1, note dit-a-jade", va: "traitre" },
              { dis: "Pourquoi tu t'intéresses autant à Inès ?", va: "ines" },
              { dis: "Je ne vends pas ma maison.", fait: "jade -2, réputation +1, cœur +1", va: "refus" },
            ],
          },
          traitre: { dit: "(Son sourire s'élargit, juste un peu.) Vraiment ? Comme c'est intéressant. Tu vois, on va très bien s'entendre. En échange, un cadeau : Victor ne regarde pas Clara comme il regarde une certaine Corbeval à lanterne.", fait: "note victor-trouble" },
          ines: { dit: "Inès ? (Un éclair froid dans ses yeux.) Inès et moi, nous avons… une histoire. Disons qu'elle me doit quelque chose. Et qu'elle le sait.", fait: "note jade-tient-ines" },
          refus: { dit: "Loyal{|e}. C'est mignon. Ça ne dure jamais, mais c'est mignon. Ma porte reste ouverte." },
        },
      },
    ],
    ensuite: {
      jour: [
        "(Elle ajuste son ruban.) Tu as réfléchi à ma proposition ?",
        "Tiens, tiens. Ma recrue préférée.",
      ],
    },
  },

  // ======================= SACHA =======================
  sacha: {
    presentation: {
      debut: {
        dit: "Attention, ne bouge pas ! Encre adore les nouveaux. (Le chat noir sur son épaule te fixe de ses yeux jaunes.) Salut, moi c'est Sacha.",
        choix: [
          { dis: "Il est magnifique.", fait: "sacha +1", va: "chat" },
          { dis: "Un chat dans la Grande Salle ?", va: "regle" },
        ],
      },
      chat: { dit: "Elle. Encre est une fille. Et elle est d'accord avec toi : elle est magnifique.", va: "neutre" },
      regle: { dit: "Aucune règle ne l'interdit. J'ai vérifié. Trois fois.", va: "neutre" },
      neutre: {
        dit: "Je suis chez les Vélandre, mais je ne fais pas la guerre aux Corbeval. Je trouve ça idiot. Les gens sont des gens, peu importe la couleur de leur cravate.",
        fait: "sacha +1",
      },
    },
    conversations: [
      {
        id: 'sacha-1',
        noeuds: {
          debut: {
            dit: "(Encre saute sur la table et vient renifler ta main.) Elle t'a adopté{|e}. C'est rare. Dis, tu es ami{|e} avec Léo, non ? Celui avec l'écharpe ?",
            choix: [
              { dis: "Oui, c'est mon ami.", va: "ami" },
              { dis: "Pourquoi ? Il t'intéresse ?", va: "interesse" },
            ],
          },
          ami: { dit: "Il a l'air gentil. Vraiment gentil. Pas comme les autres garçons d'ici qui font les fiers. (Elle caresse Encre un peu trop vite.)", va: "question" },
          interesse: { dit: "Quoi ? Non ! Enfin… (Encre miaule.) Tais-toi, toi.", va: "question" },
          question: {
            dit: "Il est… avec quelqu'un ? Je demande pour une amie. Une amie très curieuse.",
            choix: [
              { dis: "Sacha. L'amie très curieuse, c'est toi.", si: "sacha >= 2", va: "aveu" },
              { dis: "Il est amoureux de Clara.", si: "secret leo-aime-clara", fait: "sacha -1, note sacha-sait-clara", va: "clara" },
              { dis: "Je ne sais pas. Demande-lui.", va: "demande" },
            ],
          },
          aveu: {
            dit: "(Elle cache son visage dans la fourrure d'Encre.) …D'accord. Oui. C'est moi. Depuis la rentrée de l'an dernier. Tu ne le diras à personne, hein ? Surtout pas à lui.",
            fait: "secret sacha-aime-leo",
            choix: [
              { dis: "Promis. Je ne dirai rien.", fait: "sacha +2", va: "promis" },
              { dis: "Il devrait le savoir, pourtant.", va: "savoir" },
            ],
          },
          promis: { dit: "Merci. Tu es quelqu'un de bien, {prenom}. Encre ne se trompe jamais sur les gens." },
          savoir: { dit: "Peut-être. Un jour. Quand je serai prête. (Encre te donne un petit coup de tête.)" },
          clara: { dit: "Clara. (Elle sourit, mais ses yeux brillent un peu trop.) Évidemment. Tout le monde aime Clara. C'est normal." },
          demande: { dit: "Lui demander ? Tu es {fou|folle}. Je préférerais affronter Grimaud un soir de pleine lune." },
        },
      },
    ],
    ensuite: {
      jour: [
        "Encre te dit bonjour. Enfin, je crois.",
        "(Elle gratte Encre derrière l'oreille.) Tu as vu Léo, aujourd'hui ?",
      ],
    },
  },
};
