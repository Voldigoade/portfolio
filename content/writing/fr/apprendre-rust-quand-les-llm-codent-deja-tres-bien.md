---
title: Apprendre Rust quand les LLM codent déjà très bien
summary: J’apprends Rust sérieusement alors que les LLM codent toujours mieux.
  Entre envie de comprendre, agents de coding et doute sur ce qu’il reste à
  apprendre.
category: Développement
tags:
  - Rust
  - LLM
  - programmation
  - apprentissage
  - développement logiciel
publishedAt: 2025-02-08
draft: false
---
Je me demande de plus en plus si j’ai commencé à apprendre Rust au pire moment possible.

C’est probablement le langage que j’ai le plus envie de maîtriser. J’écris aussi pas mal de Python pour des scripts, mais Rust, c’est celui qui me donne envie de comprendre ce que je fais au lieu de juste arriver à un résultat qui fonctionne.

Le problème, c’est que le mot "maîtriser" commence lui-même à devenir bizarre.

Pendant que j’essaie encore de comprendre pourquoi trois caractères déclenchent une erreur du compilateur, je peux ouvrir un LLM, lui donner une description approximative d’un projet et le voir produire en quelques minutes plus de code que moi pendant toute une soirée.

Et oui, je sais. Quantité de code **≠** qualité.

C’est justement pour ça que le problème est plus chiant que "les LLM sont meilleurs que les développeurs". 

Je ne pense pas ça. Mais ça ne m’empêche pas de regarder leur vitesse de progression et de me demander, parfois, ce que je suis exactement en train d’apprendre à faire.

## Je peux passer beaucoup trop de temps sur un détail

Quand j’apprends un truc, j’ai du mal à accepter "ça s’écrit comme ça" comme réponse.

Récemment, je me suis arrêté sur une expression aussi basique que :

```rust
path == "."
```

Évidemment, aujourd’hui je peux dire que ça compare deux valeurs et que le résultat est un booléen.

Mais ce n’était pas vraiment ce que je voulais comprendre.

Je voulais comprendre pourquoi cette expression pouvait déjà être une question à elle toute seule. 

Qu’est-ce qui est comparé exactement ? Pourquoi le résultat devient `true` ou `false` ? Comment ce résultat arrive ensuite dans un `if` ? Pourquoi on n’a pas besoin d’écrire une sorte de question explicite autour ?

C’est ridicule vu de loin. Trois minutes de lecture pour quelqu’un qui connaît déjà le concept, potentiellement beaucoup plus quand tu débutes et que tu refuses de laisser une zone floue derrière toi.

Mais j’aime bien ça.

Enfin, "j’aime bien", jusqu’au moment où ça fait quarante minutes que je regarde la même erreur et que la solution était un `&`.

Rust est très bon pour ce genre de relation toxique. Tu lances :

```bash
cargo run
```

Le compilateur t’explique précisément pourquoi ton idée est mauvaise. Tu corriges. Il découvre une deuxième raison pour laquelle ton idée était mauvaise. Tu corriges encore. Puis, pendant environ trente secondes, "ça compile" devient dans ton cerveau une certification ISO de qualité logicielle.

Et après tu exécutes le programme.

Bon.

Mais c’est précisément ce processus que j’aime dans le fait d’apprendre. Le moment où quelque chose qui ressemblait à une erreur complètement arbitraire commence enfin à avoir du sens. Le moment où je comprends pourquoi le borrow checker refuse mon truc au lieu de chercher seulement la combinaison de caractères qui va le faire taire.

Je ne veux pas juste mémoriser Rust. Je veux construire le modèle mental derrière.

Et ça prend du temps.

## Pendant ce temps, l’agent a déjà fini le README

Le contraste devient assez violent dès que je commence un projet.

Moi :

```bash
cargo new something
cd something
```

Et à partir de là je commence à réfléchir à ce que je veux mettre où, à la structure, aux types, aux erreurs, aux dépendances, à tout ce que je ne sais pas encore.

J’allais écrire `git init` ici pour la blague, puis je me suis rappelé que Cargo initialise déjà Git par défaut quand il le peut.

Même dans mon propre exemple, l’outil avait déjà fait une étape à ma place.

Un agent de coding, lui, peut partir du même point et aller beaucoup plus loin presque immédiatement. Créer la structure, plusieurs modules, écrire les tests, lancer les commandes, corriger ce qui casse, toucher à la CI, préparer un diff.

Et probablement produire un README avec une section `🚀 Features` pour un CLI de 3000 lignes qui devait initialement faire trois trucs.

Ça ne veut pas dire que le résultat est bon.

Le code peut être bancal. L’architecture peut être bizarre. Il peut y avoir des edge cases oubliés, une dependency sortie de nulle part, un choix de sécurité catastrophique ou simplement vingt fichiers qui donnent l’impression d’avoir une raison d’exister jusqu’au premier vrai refactor.

Un projet généré vite n’est pas automatiquement un projet maintenable.

Je le sais.

Le problème, c’est que cette objection ne règle pas vraiment ce qui me travaille.

Parce que même si je dois relire le code, le debugger, le tester, le corriger et parfois jeter une partie de ce qui a été généré, le point de départ a quand même changé.

Avant, savoir construire le truc était directement lié au fait de savoir écrire le truc.

Maintenant, je peux parfois obtenir le truc avant d’avoir appris à l’écrire.

Et là, je sais pas trop quoi faire de cette information.

Si mon seul objectif est d’avoir le programme final, la réponse est évidente : j’utilise les meilleurs outils disponibles. Je donne le maximum de travail automatisable à l’agent, je review, je teste, je garde ce qui est bon et je passe à la suite.

Faire autrement juste pour pouvoir dire "100% hand-written" ressemble surtout à une façon très élaborée de perdre du temps.

Je suis développeur. Si un outil me rend réellement plus efficace, je vais l’utiliser.

Mais je ne suis pas certain que mon seul objectif soit le programme final.

## Le truc que je risque d’automatiser, c’est peut-être justement celui que j’aime

Je crois qu’une partie de ce que j’aime dans le dev, c’est le résultat.

Avoir un outil qui marche. Un projet que je peux lancer. Une idée qui est passée de "ça serait marrant si..." à quelque chose de réel dans un repo.

Mais il y a aussi tout ce qu’il y a avant.

Comprendre pourquoi ça casse.

Changer un truc.

Relancer.

Lire les logs.

Se rendre compte que l’hypothèse de départ était fausse.

Faire un refactor parce que la première version était dégueulasse.

Passer beaucoup trop de temps sur un détail qui n’intéressera probablement jamais personne.

Puis finir par comprendre.

C’est difficile à expliquer sans tomber dans le romantisme du "vrai développeur qui souffre devant son terminal", et ce n’est pas du tout ce que je veux dire. Je ne pense pas que galérer soit noble. Je ne veux pas préserver artificiellement les compiler errors comme on préserverait une espèce menacée.

Si un LLM peut m’éviter trois heures de boilerplate inutile, très bien.

S’il peut retrouver un bug plus vite que moi, encore mieux.

S’il peut m’écrire un test auquel je n’avais pas pensé, fair enough.

Mais si je lui donne systématiquement les parties que je ne sais pas encore faire, à quel moment est-ce que j’apprends à les faire ?

Et si je ne les apprends jamais vraiment, à quel moment est-ce que je deviens capable de juger correctement ce qu’il me donne ?

C’est là que le cercle devient un peu bizarre.

On dit souvent qu’il faudra surtout savoir review le code généré. D’accord. Mais faire une bonne code review demande justement de comprendre ce qu’on regarde. Débugger demande de comprendre. Choisir entre deux architectures demande de comprendre. Voir qu’une abstraction est inutile, qu’une API est mal pensée ou qu’un fix masque le vrai problème demande de comprendre.

Donc il faut apprendre.

Sauf que l’outil qui me pousse à apprendre plus vite est aussi celui qui peut faire à ma place une grande partie des exercices qui m’auraient permis d’apprendre.

Skill issue, probablement.

Je pourrais simplement décider d’utiliser les LLM d’une certaine manière : pas de génération complète quand j’apprends, seulement des explications, des pistes, une review après coup. Et en pratique c’est souvent ce que j’essaie de faire.

Mais même là, je sais qu’à côté il existe un bouton beaucoup plus rapide.

Quand je bloque une heure sur un problème, ce bouton devient soudainement très intéressant.

Et il fonctionne de mieux en mieux.

C’est ça qui change vraiment la sensation.

Ce n’est pas juste avoir Stack Overflow en plus rapide. Ce n’est pas juste de l’autocomplétion. Je peux donner une tâche à un agent et revenir avec du code, des tests et des modifications déjà exécutées dans le repo.

Forcément, quand toi tu es encore en train de te demander pourquoi ton `if` reçoit un booléen, la comparaison est un peu brutale.

## Je ne sais plus exactement ce que veut dire "apprendre un langage"

Il y a quelques années, j’aurais probablement défini ça assez simplement.

Apprendre Rust, c’est devenir progressivement capable d’écrire des programmes de plus en plus compliqués en Rust.

Cette définition fonctionne encore.

Mais elle n’est peut-être plus suffisante.

Est-ce que j’apprends Rust pour pouvoir écrire moi-même n’importe quel programme dont j’ai besoin ?

Ou est-ce que je l’apprends pour être assez bon pour lire du Rust, repérer ce qui est faux, guider un agent, comprendre une stack trace, debugger, refactor, choisir une abstraction et savoir quand le modèle raconte n’importe quoi avec beaucoup de confiance ?

Techniquement, les deux demandent de connaître le langage.

Mais ce n’est pas exactement la même relation avec le code.

Et surtout, ce n’est pas exactement la même passion.

Parce que si le plaisir venait uniquement du produit fini, je n’aurais aucun problème. Plus l’outil est fort, mieux c’est.

Mais une partie du plaisir vient du fait de réussir à le produire moi-même.

Pas pour prouver quelque chose à qui que ce soit. Juste parce que comprendre un système que je ne comprenais pas une heure avant est satisfaisant.

Je veux apprendre.

Je veux construire.

Je veux utiliser les meilleurs outils possibles.

En théorie, ces trois phrases devraient très bien aller ensemble.

En pratique, elles commencent parfois à se marcher dessus.

Je pourrais demander à un modèle d’écrire mon prochain morceau de Rust. Il irait probablement plus vite que moi. Il éviterait sûrement certaines erreurs que je vais faire dans cinq minutes. Et si mon but immédiat est juste de faire avancer le projet, ça peut être exactement la bonne décision.

Je vais quand même ouvrir `main.rs`.

Je vais probablement essayer moi-même.

Pas parce que je pense pouvoir "battre" les modèles à ce jeu. Ce serait une raison assez catastrophique d’apprendre quoi que ce soit en 2026.

Je crois juste que j’ai encore envie de comprendre le code avant de déléguer complètement le fait de l’écrire.

Je ne sais pas encore si c’est une phase normale quand on apprend, une façon raisonnable d’utiliser ces outils, ou juste moi qui essaie de conserver une partie du dev que j’aime pendant qu’elle change sous mes yeux.

Anyway.

```
cargo run
```

