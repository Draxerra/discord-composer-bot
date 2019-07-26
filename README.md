# Discord Composer Bot (WIP)

The Discord Composer Bot allows users to create their own music through messages, with the ability to have it playback to them via a voice channel.

## Prerequisites

The application requires [Node.js](https://nodejs.org/en/download/), [ffmpeg](https://ffmpeg.org/download.html), [Timidity++](https://sourceforge.net/projects/timidity/), [MuseScore](https://musescore.org/en/download) and [FluidSynth](https://github.com/FluidSynth/fluidsynth/releases). You'll need to ensure all of these are available on your path environment variable.

Fill out the config in `config.sample.json` and rename it to `config.json`. The settings will be determined by this file.

Place your soundfonts in the `src/soundfonts` directory.

Once cloned, run the following command in the root directory:
```
$ npm install
```

## Possible Resolutions

MuseScore may require a headless display in order to work. [Xvfb](https://packages.debian.org/sid/xvfb) is one such headless display. Try running the following commands if you are on linux:
```sh
$ sudo apt-get install Xvfb
$ Xvfb :0 -screen 0 1280x768x24&
$ export DISPLAY=:0
```

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

### Live Server

To view a live version of the bot on a server, click [here](https://discord.gg/jtrtv75). The prefix for all the commands is `c>`.

### Commands

#### add-track
Adds a new track

#### add pitch=[] duration=[] track=[] wait=[] velocity=[] instrument=[] before=[]
Adds a note (e.g. add pitch=d4 duration=128 track=2 velocity=40 wait=128 instrument=harmonica before=2)

#### edit note=[] track=[] pitch=[] duration=[] wait=[] velocity=[] instrument=[] before=[]
Edits a note (e.g. edit note=1 track=2 pitch=e4 duration=256 velocity=30 wait=128 instrument=harmonica before=1)

#### help
Lists all the available commands

#### instruments
Lists all the available instruments

#### list track=[]
Lists the notes in the specified track (e.g. list track=2)

#### notes
Shows all the notes and their tick equivalent

#### play instrument=[] tracks=[] tempo=[]
Plays the specified tracks (e.g. play instrument=harmonica tracks=1+2 tempo=170)

#### remove note=[] track=[]
Removes a note (e.g. remove note=3 track=2)

#### remove-track track=[]
Removes the specified track (e.g. remove-track track=2)

#### save name=[] tracks=[]
Saves the specified tracks as a MIDI file (e.g. save name=test tracks=1+2)

#### sheet name=[] tracks=[]
Generates sheet music for the specified tracks (e.g. sheet name=test tracks=1+2)
