import { spawn } from "child_process";
import { NoteEvent, ProgramChangeEvent, Track, Writer } from "midi-writer-js";
import Midi from "data/midi";
import { Arg, Command, ParseArgs } from "utils/commands";
import { Instruments } from "soundfonts";

export const play = Command({
    name: "play",
    description: "Plays the specified tracks (e.g. play instrument=harmonica tracks=1+2)",
    args: {
        instrument: Arg<string>({
            type: String
        }),
        tracks: Arg<number[]>({
            type: Number,
            default: [1],
            splitChar: "+"
        })
    },
    run: (msg, client, args) => {
        ParseArgs(play.args, args).then(async({ instrument, tracks }) => {
            try {
                // Throw an error if the user is not in a voice channel.
                if (!msg.member.voiceChannel) {
                    msg.reply("you need to join a voice channel first!");
                    return;
                }

                // Throw an error if any tracks specified to be played are empty.
                const indexes = tracks.filter(track => !(Midi[track - 1] && Midi[track-1].length));
                if (indexes.length) {
                    msg.reply(`you need to add some notes to track${indexes.length > 1 ? "s" : ""} ${indexes.join("+")}!`);
                    return;
                }

                const instruments = await Instruments;
                instrument = instrument ? instrument : (instruments[0] ? instruments[0].name : "");
                const midiInstrument = instruments.find(midiInstrument => midiInstrument.name === instrument);
                if (!midiInstrument) {
                    msg.reply("instrument does not exist!");
                    return;
                }

                // Comnvert the multi-dimensional array of notes to midi binary.
                const midi = new Writer(tracks.map(track => {
                    const t = new Track();
                    t.addEvent(new ProgramChangeEvent({ instrument: midiInstrument.instrument }));
                    t.addEvent(Midi[track - 1].map(note => new NoteEvent({...note, channel: midiInstrument.channel})));
                    return t;
                }));
                const buffer = Buffer.from(midi.buildFile());
        
                // Join the voice channel with the user.
                await msg.member.voiceChannel.leave();
                const connection = await msg.member.voiceChannel.join();
        
                // Spawn a timidity instance to play the MIDI buffer with the specified soundfont.
                const timidity = spawn("timidity", [`-x soundfont ./src/soundfonts/${midiInstrument.soundfont}`, "-s", "65000", "-", "-Ow", "-o", "-"]);
                timidity.stdin.write(buffer);
                const dispatcher = connection.playStream(timidity.stdout, { passes: 4, volume: 1, bitrate: 96000 });
        
                // Leave the voice channel once done playing.
                dispatcher.on("start", () => msg.reply(`here's your track so far using the ${instrument} instrument...`));
                dispatcher.on("end", () => msg.member.voiceChannel.leave());
                dispatcher.on("error", (err) => { throw err; });
                
            } catch (err) {
                console.error(err);
                msg.member.voiceChannel.leave();
                msg.reply("oh no! something went wrong :(");
            }
        }).catch(err => {
            msg.reply(err.message);
        });
    }
});
