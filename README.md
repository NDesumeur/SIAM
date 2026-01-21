# SIAM

Jeu **SIAM** réalisé en **L2 Informatique** en **développement web**.  
Le projet propose une version jouable du jeu Siam directement dans le navigateur.

## Sommaire
- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Règles du jeu (rappel)](#règles-du-jeu-rappel)
- [Installation & Lancement](#installation--lancement)
- [Comment jouer](#comment-jouer)
- [Crédits](#crédits)

## Aperçu
**Siam** est un jeu de plateau à information parfaite où deux joueurs s’affrontent pour pousser un **rocher** hors du plateau à l’aide d’animaux.  
Cette implémentation web gère l’affichage du plateau, les interactions et la logique de jeu.


## Fonctionnalités
- Plateau jouable dans le navigateur
- Interaction par clic (sélection / déplacement / orientation)
- Gestion des tours (joueur 1 / joueur 2)
- Application des règles de poussée
- Réinitialisation / nouvelle partie
- Interface et style en CSS

## Règles du jeu 
> Les règles exactes peuvent légèrement varier selon les versions. Voici le principe général du Siam.

### But
Pousser un **rocher** **hors du plateau** par un des bords pour gagner.

### Éléments
- 2 joueurs
- Des pièces “animaux” pour chaque joueur
- Un ou plusieurs rochers 

### Actions typiques d’un tour
Selon la version, un joueur peut généralement :
- **Entrer** une nouvelle pièce sur le plateau depuis un bord, orientée dans une direction
- **Déplacer** une de ses pièces
- **Tourner** (changer l’orientation) d’une de ses pièces
- **Pousser** une chaîne de pièces/rochers si la “force” est suffisante

### Poussée (principe)
Une poussée est possible si, dans la direction de poussée :
- La somme des pièces orientées “dans le bon sens” du côté qui pousse est **strictement supérieure** à la somme des opposants/obstacles qui résistent (selon la règle appliquée).
- Si la poussée réussit, toute la ligne (pièces + rocher) est décalée d’une case, et un élément peut sortir du plateau.

> Si ton code suit une règle précise (ex : calcul exact de la force), n’hésite pas à détailler ici.

## Installation & Lancement
### Option 1 — Simple (recommandé)
1. Cloner le dépôt :
   ```bash
   git clone https://github.com/NDesumeur/SIAM.git
   ```
2. Ouvrir le dossier.
3. Ouvrir le fichier **HTML principal** dans un navigateur (ex : `index.html`).

### Option 2 — Avec un serveur local (souvent plus propre)
Si ton navigateur bloque certaines choses en `file://` :
- Avec VS Code : extension **Live Server**
- Ou en Python :
  ```bash
  python -m http.server 8000
  ```
Puis ouvrir `http://localhost:8000`

## Comment jouer
1. Lancer la page web du jeu.
2. Chaque joueur joue à tour de rôle.
3. Sélectionner une pièce puis choisir l’action disponible (déplacement, rotation, entrée, poussée…).
4. Objectif : faire sortir le rocher du plateau.


## Crédits
Projet réalisé en **L2 Informatique** (web).  
Auteur : **NDesumeur** **Vikus**.
