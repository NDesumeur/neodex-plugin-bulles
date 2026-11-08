# Bulles

Un jeu de tir de bulles : vise, tire vers le plafond, et regroupe les couleurs. Trois bulles pareilles qui se touchent éclatent, et toutes celles qui ne tiennent plus au plafond tombent. Vide le plafond avant qu'il ne descende jusqu'à toi.

*English version: [README.en.md](README.en.md)*

## Commandes

- **Souris** : viser ; le pointillé montre la trajectoire, rebonds sur les bords compris.
- **Clic** : tirer.
- **← / →** : viser au clavier ; **Espace** ou **↑** : tirer.
- **X** : échanger la bulle prête avec la suivante (affichée en bas à gauche).
- **P** : pause.

## Règles

- La bulle tirée file en ligne droite, rebondit sur les murs, et se colle à la première bulle (ou au plafond) qu'elle touche, sur une grille en nid d'abeille.
- Si elle forme un groupe d'**au moins trois bulles de la même couleur** qui se touchent, le groupe éclate.
- Toutes les bulles qui ne sont plus reliées au plafond, même indirectement, **tombent**.
- **Tous les 7 tirs**, le plafond descend d'une rangée ; le compte à rebours est affiché en haut à droite.
- La partie est perdue quand une bulle dépasse la ligne pointillée du bas : « C'est plein ! ».
- Les bulles à tirer ne prennent que des couleurs encore présentes sur le plateau.
- Quand le plateau est vide, un nouveau plafond de 6 rangées arrive, avec une couleur de plus (de 4 au départ jusqu'à 6), et le plafond remonte en haut.

## Points

- **10 points** par bulle éclatée.
- Chaque bulle qui tombe rapporte **20 points**, et davantage quand la grappe est grosse (20 × (1 + nombre de bulles tombées ÷ 4)) : 4 bulles tombées valent 160 points, 8 en valent 480.
- **500 points** de bonus pour un plateau vidé.

## Statistiques

Le panneau Records montre ton **meilleur score**, le nombre de **parties** et le total de **bulles éclatées** (tombées comprises).

## Données et synchronisation

Ton meilleur score et tes compteurs sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Bulles → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
