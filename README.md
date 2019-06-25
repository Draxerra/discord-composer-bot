# Discord Composer Bot

The Discord Composer Bot allows users to create their own music through messages, with the ability to have it playback to them via a voice channel.

## Prerequisites

The application requires [Node.js](https://nodejs.org/en/download/), [ffmpeg](https://ffmpeg.org/download.html) and [Timidity++](https://sourceforge.net/projects/timidity/).

Fill out the config in `config.sample.json` and rename it to `config.json`. The settings will be determined by this file.

Place all your soundfonts in the `src/soundfonts` directory.

### Dev Server

To start the application up:
```sh
$ npm run dev
```

**This server should NOT be used in production.**

### Prod Server

To generate the build file:
```sh
$ npm run build
```

To start the prod server:
```sh
$ npm start
```
