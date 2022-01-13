# Bot Twitter RSS

Bot Twitter qui envoie mon flux RSS toutes les 30 minutes.
Mon flux RSS se trouve dans une base MongoDB.

## Installation

Utilisez le package manager [npm](www.npmjs.com) pour installer vos dépendances.

```bash
npm install
```

Enlever le .example du fichier .env.example puis remplir les champs du fichier
(Les clés API peuvent être récupérées sur le site de [Twitter](https://developer.twitter.com)).

## Usage

```bash
npm run dev # lance le bot en version dev
```

## Mise en production

```bash
npm run build # crée la version de production dans /dist
npm start # lance le bot en version de production
```

## Contribution

Il existe encore beaucoup de bugs et le code n'est pas du tout optimisé alors les pull requests sont bien évidemment les bienvenues.

## License

[MIT](https://choosealicense.com/licenses/mit/)
