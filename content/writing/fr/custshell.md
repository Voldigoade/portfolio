---
title: "Custshell "
summary: Transcription du vocal
category: custshell
publishedAt: 2026-10-30
draft: false
---
# Contexte

Le bot actuel est développé en Python. En pratique, je trouve que cette base devient assez pénible à maintenir et que l’expérience obtenue n’est pas idéale, notamment pour toute la partie apprentissage/cours directement dans Discord.

Je travaille dessus depuis plusieurs jours, mais je commence à me demander si continuer à développer toutes les fonctionnalités directement dans Discord est réellement la meilleure approche.

L’idée serait donc de conserver Discord, mais de déplacer une grosse partie de l’expérience vers une véritable application web dédiée.

# Idée générale

Créer une application web complète mais minimaliste, avec une interface beaucoup plus propre et agréable que le système actuel basé uniquement sur Discord.

L’objectif serait notamment d’améliorer :

- les cours et le système d’apprentissage ;  
- la progression des utilisateurs ;  
- le leaderboard ;  
- les profils ;  
- l’administration ;  
- la persistance des données ;  
- l’expérience générale sur PC et mobile.

Discord resterait connecté au projet, mais ne serait plus forcément l’endroit où tout se passe.

# Comptes utilisateurs et progression

Chaque utilisateur pourrait créer son propre compte et se connecter au site.

Toutes les informations importantes seraient enregistrées dans une base de données : compte, progression, cours commencés/terminés, niveau, etc.

L’intérêt principal est de pouvoir reprendre exactement là où l’on s’était arrêté, quel que soit l’appareil utilisé.

Exemple :

Un utilisateur commence une leçon sur son PC et s’arrête à la leçon 3, page 7.

Plus tard, il se connecte depuis son téléphone ou depuis un autre ordinateur.

En se reconnectant à son compte, il retrouve automatiquement sa progression et reprend exactement à cet endroit.

# Cours / apprentissage

Les cours seraient directement intégrés au site plutôt que principalement dans Discord.

Cela permettrait de construire quelque chose de beaucoup plus propre visuellement et plus pratique à utiliser.

Le système pourrait gérer notamment :

- plusieurs cours/modules ;  
- plusieurs leçons par cours ;  
- la progression au sein de chaque cours ;  
- la reprise automatique ;  
- le suivi des leçons terminées ;  
- éventuellement les points/récompenses liés à l’apprentissage.

L’objectif est de rendre toute la partie apprentissage nettement plus propre que ce qui est actuellement possible avec l’UX de Discord.

# Leaderboard et niveaux

Le leaderboard serait également affiché directement sur le site avec une interface plus propre.

La progression enregistrée en base de données permettrait d’avoir un véritable système de niveaux.

Une intégration avec Discord pourrait ensuite synchroniser cette progression.

Par exemple :

- utilisateur atteignant un certain niveau → rôle Discord automatiquement attribué ;  
- niveau 1 → rôle Discord niveau 1 ;  
- niveau 2 → rôle Discord niveau 2 ;  
- progression importante dans les cours → rôle/récompense spécifique ;  
- position élevée dans le leaderboard → possibilité d’attribuer automatiquement un rôle.

Les seuils et les récompenses restent à définir.

# Administration

Il y aurait une véritable page d’administration.

Les trois administrateurs actuels pourraient chacun créer leur compte.

Une fois leurs comptes créés, je pourrais les ajouter comme administrateurs du site.

Les administrateurs auraient ensuite accès à des fonctionnalités réservées, notamment la gestion et la création de contenu.

# Création de contenu

Depuis l’espace administrateur, il serait possible de créer directement des leçons.

Il serait également possible d’écrire des articles de blog.

Chaque administrateur pourrait donc publier ses propres articles et contribuer directement au contenu du site sans avoir à modifier le code.

# Profils utilisateurs

Chaque utilisateur disposerait d’un profil.

L’idée serait de permettre plusieurs possibilités autour de ce profil :

- modifier/personnaliser son profil ;  
- avoir une page publique ;  
- partager son profil avec d’autres personnes ;  
- afficher certaines informations sur sa progression ;  
- éventuellement transformer le profil en petit portfolio.

Le contenu exact et le degré de personnalisation restent à définir.

# Portfolio

Une fonctionnalité de portfolio pourrait être intégrée au profil.

Cela permettrait à un utilisateur de présenter ses projets, compétences, réalisations ou autres informations utiles directement depuis son compte.

C’est encore une idée à développer plutôt qu’une fonctionnalité définitivement définie.

# Intégration Discord

Le projet web ne signifie pas forcément abandonner Discord.

Au contraire, le site et Discord pourraient communiquer.

Discord pourrait rester utile pour la communauté et les discussions, tandis que le site gérerait mieux les parties structurées comme :

- apprentissage ;  
- progression ;  
- leaderboard ;  
- comptes ;  
- profils ;  
- administration ;  
- contenu.

Le bot Discord pourrait ensuite servir principalement de passerelle entre les deux systèmes, par exemple pour synchroniser automatiquement les rôles avec le niveau obtenu sur le site.

# Hébergement

Pour commencer, je pense héberger la partie nécessitant un serveur sur mon VPS actuel.

À plus long terme, si je ne conserve plus ce VPS, il serait éventuellement possible de transférer le projet vers le VPS d’un autre membre de l’équipe.

Pour le frontend, plusieurs solutions sont envisagées, par exemple :

- Vercel ;  
- Cloudflare Pages ;  
- ou une autre solution similaire.

L’architecture exacte reste donc encore à décider.

# Nom de domaine

On pourrait également acheter un nom de domaine dédié au projet QuestShell.

Le coût envisagé serait d’environ 5 €, selon le domaine choisi.

Cela permettrait d’avoir une adresse propre dédiée au projet plutôt qu’une URL d’hébergement générique.

Le domaine exact reste à choisir.

# État actuel

Le développement de cette nouvelle application web n’a pas encore réellement commencé.

Avant de partir dans cette direction, je voulais donc avoir l’avis des autres membres de l’équipe.

La décision principale à prendre est :

**Est-ce qu’on continue à développer principalement le système actuel directement dans Discord, ou est-ce qu’on bascule vers une véritable application web connectée à Discord ?**

Personnellement, l’application web permettrait d’aller beaucoup plus loin sur l’UX, les cours, la progression, les comptes, les profils et l’administration.

# Points sur lesquels j’attends votre avis

Il faut notamment décider :

1. Si l’idée de passer à une application web vous intéresse.
2. Si vous préférez continuer principalement sur Discord.
3. Quelles fonctionnalités vous aimeriez voir sur le site.
4. Ce qu’on devrait ajouter ou retirer parmi les idées proposées.
5. Comment organiser les niveaux, le leaderboard et les rôles Discord.
6. Jusqu’où pousser la personnalisation des profils/portfolios.
7. Quelle architecture/hébergement utiliser à terme.

Si vous avez d’autres idées de fonctionnalités, dites-les-moi : je ne pense évidemment pas à tout et le projet peut évoluer avant que je commence réellement le développement.