# Discord Composer Bot (WIP)

The Discord Composer Bot allows users to create their own music through messages, with the ability to have it playback to them via a voice channel.

## Prerequisites

The application requires [Node.js](https://nodejs.org/en/download/), [ffmpeg](https://ffmpeg.org/download.html) and [Timidity++](https://sourceforge.net/projects/timidity/). You'll need to ensure all of these are available on your path environment variable.

Fill out the config in `config.sample.json` and rename it to `config.json`. The settings will be determined by this file.

Place all your soundfonts in the `src/soundfonts` directory. Some basic soundfonts can be found [here](http://freepats.zenvoid.org/). Currently only .sf2 files are supported.

Once cloned, run the following command in the root directory:
```
$ npm install
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

To view a live version of the bot on a server, click [here](https://discord.gg/jtrtv75).

### Commands

#### add-track
Adds a new track

#### add pitch=[] duration=[] track=[] wait=[] velocity=[] before=[]
Adds a note (e.g. add pitch=d4 duration=128 track=2 velocity=40 wait=128 before=2)

#### edit note=[] track=[] pitch=[] duration=[] wait=[] velocity=[] before=[]
Edits a note (e.g. edit note=1 track=2 pitch=e4 duration=256 velocity=30 wait=128 before=1)

#### help
Lists all the available commands

#### instruments
Lists all the available instruments

#### list
Lists the current tracks

#### notes
Shows all the notes and their tick equivalent

#### play instrument=[] tracks=[]
Plays the specified tracks (e.g. play instrument=guitar tracks=1+2)

#### remove note=[] track=[]
Removes a note (e.g. remove note=3 track=2)

#### remove-track track=[]
Removes the specified track (e.g. remove-track track=2)
