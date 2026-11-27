// Les dialogues des personnages.
//
// Comment ça marche :
// - Chaque personnage a une conversation de « jour », et parfois une de « nuit ».
// - « premiere » : la première conversation. Elle commence toujours par « debut ».
// - Une réplique : dit = ce que dit le personnage.
//     va : "nom"   → au toucher, on passe à la réplique « nom »
//     choix : [...] → tu choisis ta réponse ; chaque choix a « dis » (ta phrase) et « va »
//     ni va ni choix → la conversation s'arrête
// - « ensuite » : ce qu'il dit quand tu reviens lui parler (une phrase tirée au hasard).
// - Ce qui est entre parenthèses s'affiche en italique (gestes, regards).
//
// Pour modifier : change seulement le texte entre guillemets "…".
// Si tu veux mettre des guillemets dans une phrase, utilise « » plutôt que ".

export const dialogues = {

  // ======================= LÉO =======================
  leo: {
    jour: {
      premiere: {
        debut: {
          dit: "Te voilà enfin ! J'ai essayé de te garder une place à la table de Corbeval. Hugo l'a donnée à quelqu'un d'autre.",
          choix: [
            { dis: "Merci d'avoir essayé, Léo.", va: "merci" },
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
          choix: [
            { dis: "Promis, je garde ça pour moi.", va: "promis" },
            { dis: "Tu devrais le lui dire.", va: "dire" },
          ],
        },
        promis: { dit: "Merci. Je savais que je pouvais compter sur toi. On en reparle, d'accord ?" },
        dire: { dit: "Le lui dire ? Elle ne sait même pas que j'existe. (Il jette un regard vers elle.) Pas encore." },
      },
      ensuite: [
        "Tu crois qu'elle m'a regardé, tout à l'heure ?",
        "Pas un mot à Maëlle, hein.",
        "(Il triture son écharpe.) Je n'arrive pas à manger quand elle est dans la salle.",
      ],
    },
  },

  // ======================= MAËLLE =======================
  maelle: {
    jour: {
      premiere: {
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
        secret: { dit: "Moi ? Aucun. (Ses yeux glissent une seconde vers Hugo.) Absolument aucun. Pourquoi cette question ?", va: "fin" },
        fin: { dit: "Reviens me voir quand tu veux. Et si tu entends quelque chose d'intéressant… tu sais où me trouver." },
      },
      ensuite: [
        "Alors, du nouveau ? Non ? Dommage.",
        "Chut, je compte qui parle à qui.",
        "(Elle remonte ses lunettes roses.) Tu as vu comment Elsa regarde notre table ? Intéressant…",
      ],
    },
  },

  // ======================= HUGO =======================
  hugo: {
    jour: {
      premiere: {
        debut: {
          dit: "Toi. Tu es à Corbeval maintenant, alors écoute bien. Ici, le capitaine, c'est moi.",
          choix: [
            { dis: "Bonjour, capitaine.", va: "poli" },
            { dis: "Tu te prends pour qui ?", va: "insolent" },
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
      ensuite: [
        "Tu n'as rien de mieux à faire que traîner ?",
        "Va réviser. Les Vélandre, eux, ne dorment jamais.",
        "(Il redresse son insigne.) Quoi encore ?",
      ],
    },
  },

  // ======================= ZOÉ =======================
  zoe: {
    jour: {
      premiere: {
        debut: {
          dit: "Tu me fixes depuis tout à l'heure. C'est la lanterne qui t'intrigue ?",
          choix: [
            { dis: "Pourquoi une lanterne en plein jour ?", va: "lanterne" },
            { dis: "Non. C'est toi.", va: "toi" },
          ],
        },
        lanterne: { dit: "Parce que dans ce château, il fait toujours plus sombre qu'on ne le croit.", va: "frere" },
        toi: { dit: "(Elle hausse un sourcil.) Direct. J'aime bien. Mais ne t'y habitue pas.", va: "frere" },
        frere: {
          dit: "Mon frère était à Corbeval, il y a deux ans. Un soir, il est sorti du dortoir. On ne l'a jamais revu. Les profs disent qu'il s'est enfui.",
          choix: [
            { dis: "Tu ne les crois pas ?", va: "croire" },
            { dis: "Ça doit être terrible.", va: "terrible" },
          ],
        },
        croire: { dit: "Pas une seconde. Cette lanterne, c'était la sienne. Il ne serait jamais parti sans elle.", va: "fin" },
        terrible: { dit: "Garde ta pitié. Ce qu'il me faut, ce sont des réponses. Cette lanterne, c'était la sienne. Il ne serait jamais parti sans elle.", va: "fin" },
        fin: { dit: "Si un jour tu as le courage de te promener la nuit… viens me trouver ici." },
      },
      ensuite: [
        "La nuit, le château dit la vérité. Le jour, il ment.",
        "Tu as réfléchi ? Pour la nuit ?",
      ],
    },
    nuit: {
      premiere: {
        debut: {
          dit: "Chut ! Baisse la voix. Grimaud fait sa ronde, je l'ai entendu dans le couloir.",
          choix: [
            { dis: "Qu'est-ce que tu fais ici en pleine nuit ?", va: "quoi" },
            { dis: "Tu m'avais dit de venir te trouver.", va: "venir" },
          ],
        },
        quoi: { dit: "La même chose que toi, j'imagine. Je n'arrive pas à dormir. Alors j'écoute.", va: "chaines" },
        venir: { dit: "Et tu l'as fait. (Un petit sourire.) Je ne pensais pas que tu oserais.", va: "chaines" },
        chaines: {
          dit: "Écoute… Tu entends ? Des chaînes. Toutes les nuits, vers minuit, ça vient d'en haut. Personne d'autre ne les entend.",
          choix: [
            { dis: "C'est peut-être un fantôme.", va: "fantome" },
            { dis: "Partons avant de nous faire prendre.", va: "partir" },
          ],
        },
        fantome: { dit: "Peut-être. Et peut-être qu'il sait où est mon frère.", va: "fin" },
        partir: { dit: "Vas-y si tu veux. Moi, je reste encore un peu.", va: "fin" },
        fin: { dit: "Une autre nuit, on ira voir d'où viennent ces bruits. Ensemble. Si tu oses." },
      },
      ensuite: [
        "Pas si fort ! Tu vas nous faire repérer.",
        "(Elle lève sa lanterne vers la charpente.) Toujours ces chaînes… Tu les entends ?",
      ],
    },
  },

  // ======================= NOAH =======================
  noah: {
    jour: {
      premiere: {
        debut: {
          dit: "Oh… euh… salut. Tu peux t'asseoir ailleurs si tu veux. Les gens font souvent ça.",
          choix: [
            { dis: "Je préfère m'asseoir ici.", va: "reste" },
            { dis: "Pourquoi tu es tout seul ?", va: "seul" },
          ],
        },
        reste: { dit: "Ah. D'accord. (Il pousse ses livres pour te faire de la place.) Merci.", va: "bonnet" },
        seul: { dit: "C'est plus simple. Quand je suis seul, ils ne me voient pas.", va: "bonnet" },
        bonnet: {
          dit: "Les amis de Victor… Ils m'ont pris mon bonnet ce matin. Ils l'ont jeté dans la fontaine du parc. Je l'ai récupéré, mais…",
          choix: [
            { dis: "Ils ne vont pas s'en tirer comme ça.", va: "defendre" },
            { dis: "Ignore-les, ils finiront par se lasser.", va: "ignorer" },
          ],
        },
        defendre: { dit: "Non, ne fais rien ! Ça ne ferait qu'empirer. Mais… merci de l'avoir dit.", va: "fin" },
        ignorer: { dit: "C'est ce que je fais depuis un an. Ils ne se lassent pas.", va: "fin" },
        fin: { dit: "Je vais aller à la bibliothèque. Là-bas, personne ne me cherche." },
      },
      ensuite: [
        "Ah, c'est toi… J'ai cru que c'était eux.",
        "Merci de venir me parler. Vraiment.",
      ],
    },
    nuit: {
      premiere: {
        debut: {
          dit: "Ah ! Tu m'as fait peur… Je ne fais rien de mal. Je ne voulais pas rester au dortoir.",
          choix: [
            { dis: "Ils t'embêtent même là-bas ?", va: "dortoir" },
            { dis: "Tu veux de la compagnie ?", va: "compagnie" },
          ],
        },
        dortoir: { dit: "Non, pas là-bas. Mais je les entends rire dans ma tête. Ici, au moins, il y a les bougies.", va: "filtre" },
        compagnie: { dit: "…Oui. Je veux bien. (Il fixe les bougies.) C'est calme, ici, la nuit.", va: "filtre" },
        filtre: {
          dit: "Tu sais… on dit que le professeur Morvan garde un filtre d'amour dans sa réserve. Un flacon rose. Avec ça, n'importe qui pourrait nous aimer.",
          choix: [
            { dis: "Ce ne serait pas vraiment de l'amour.", va: "pasamour" },
            { dis: "Tu y penses sérieusement ?", va: "serieux" },
          ],
        },
        pasamour: { dit: "Je sais. Je sais bien. C'était juste… une idée.", va: "fin" },
        serieux: { dit: "Non ! Non. Bien sûr que non. Oublie ce que j'ai dit.", va: "fin" },
        fin: { dit: "Tu devrais retourner te coucher avant que Grimaud passe. Moi, je reste encore un peu." },
      },
      ensuite: [
        "Les bougies ne s'éteignent jamais. Tu as remarqué ?",
        "Je ne dirai rien à personne. Promis.",
      ],
    },
  },

  // ======================= CLARA =======================
  clara: {
    jour: {
      premiere: {
        debut: {
          dit: "Tiens, la recrue de Corbeval. Tu sais que tu es du mauvais côté de la salle ?",
          choix: [
            { dis: "Les règles, ce n'est pas mon fort.", va: "regles" },
            { dis: "Je voulais voir de près la fameuse rose.", va: "rose" },
          ],
        },
        regles: { dit: "(Elle rit.) Ça tombe bien, moi non plus. Mais ici, on fait semblant.", va: "famille" },
        rose: { dit: "Elle ne fane jamais. Un cadeau de ma mère. Sa façon de me rappeler que je dois rester parfaite.", va: "famille" },
        famille: {
          dit: "Chez les Vélandre, tout est décidé d'avance. Nos notes, nos amis… même avec qui on ira au bal.",
          choix: [
            { dis: "Et toi, avec qui voudrais-tu y aller ?", va: "bal" },
            { dis: "Ça a l'air pesant.", va: "pesant" },
          ],
        },
        bal: { dit: "(Elle te regarde un peu trop longtemps.) C'est une question dangereuse, ça. Surtout venant de toi.", va: "victor" },
        pesant: { dit: "Tu n'as pas idée. Merci de ne pas me dire que j'ai de la chance, comme tout le monde.", va: "victor" },
        victor: { dit: "Attention, Victor nous regarde. Il déteste qu'on me parle sans sa permission. Va-t'en, avant qu'il fasse une scène." },
      },
      ensuite: [
        "Encore toi ? Victor va finir par te remarquer.",
        "(Elle effleure sa rose.) Je repensais à ce que tu m'as dit.",
      ],
    },
  },

  // ======================= VICTOR =======================
  victor: {
    jour: {
      premiere: {
        debut: {
          dit: "Un Corbeval à notre table. Quelle audace. Tu cherches ton chemin ?",
          choix: [
            { dis: "Je viens juste dire bonjour.", va: "bonjour" },
            { dis: "Je cherchais quelqu'un d'intéressant. Pas de chance.", va: "pique" },
          ],
        },
        bonjour: { dit: "Comme c'est touchant. Va le dire à ta table, ils adorent les bons sentiments.", va: "clara" },
        pique: { dit: "(Ses amis ricanent. Lui, non.) Tu as de la répartie. Profites-en tant que tu peux.", va: "clara" },
        clara: {
          dit: "J'ai remarqué que tu tournais autour de Clara. Alors je t'explique : Clara et moi, c'est arrangé depuis l'enfance.",
          choix: [
            { dis: "Arrangé par qui ? Pas par elle.", va: "parqui" },
            { dis: "Clara ne m'intéresse pas.", va: "aucune" },
          ],
        },
        parqui: { dit: "Par ceux qui comptent. Ici, les sentiments, ça ne compte pas.", va: "fin" },
        aucune: { dit: "Parfait. Alors on va bien s'entendre.", va: "fin" },
        fin: { dit: "(Son regard glisse vers Zoé, au fond de la salle, puis revient sur toi, plus dur.) Retourne à ta table. Maintenant." },
      },
      ensuite: [
        "Encore là ? Tu dois vraiment t'ennuyer chez les Corbeval.",
        "Tu regardes quoi, comme ça ?",
      ],
    },
  },

  // ======================= ELSA =======================
  elsa: {
    jour: {
      premiere: {
        debut: {
          dit: "Oh, bonjour. Toi, au moins, tu n'as pas l'air d'un pantin d'Hugo.",
          choix: [
            { dis: "Tu connais bien Hugo ?", va: "hugo" },
            { dis: "Jolie plume.", va: "plume" },
          ],
        },
        hugo: { dit: "Un peu. Beaucoup. On est sortis ensemble l'an dernier. Il l'a oublié, apparemment.", va: "regard" },
        plume: { dit: "Merci. Hugo la trouvait ridicule. C'est pour ça que je la porte.", va: "regard" },
        regard: {
          dit: "(Elle jette un œil vers la table de Corbeval.) Il nous regarde ? Ne te retourne pas. Ris, comme si j'avais dit quelque chose de drôle.",
          choix: [
            { dis: "(Rire.) Comme ça ?", va: "rire" },
            { dis: "Je ne joue pas à ce jeu-là.", va: "refus" },
          ],
        },
        rire: { dit: "Parfait. Tu as du talent. J'aurai peut-être une proposition à te faire, un de ces jours.", va: "fin" },
        refus: { dit: "Dommage. Tu changeras peut-être d'avis. Tout le monde finit par jouer, ici.", va: "fin" },
        fin: { dit: "À bientôt. Et ne dis pas à Hugo qu'on a parlé… Ou dis-le-lui. Les deux me vont." },
      },
      ensuite: [
        "Il regarde encore ? Non ? Tant pis.",
        "(Elle lisse sa plume blanche.) Ma proposition arrive bientôt. Patience.",
      ],
    },
  },
};
