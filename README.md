# Quickie
Generator tool for WASD.pt 

### Quick start:

```ssh
git clone <repo>
npm i
npm run watch -or- gulp watch
```

### Gulp

Default task is `$ gulp`, which will run all the following commands. Or, you can use them individually as needed.

```
$ gulp build:css // only processes Sass to CSS once

$ gulp sass:watch // run Sass watcher for updated files

$ gulp serve // starts browser-sync server

$ gulp build:dist // moves processed files from src/ to dist/