import { spawn } from "child_process";
import { NoteEvent, ProgramChangeEvent, Track, Writer } from "midi-writer-js";
import Midi, { ControllerChangeEvent } from "data/midi";
import { Arg, Command, ParseArgs } from "utils/commands";
import { Instruments, path } from "soundfonts";

export const play = Command({
    name: "play",
    description: "Plays the specified tracks (e.g. play instrument=harmonica tracks=1+2)",
    args: {
        instrument: Arg<string | undefined>({
            type: String,
            oneOf: async(val) => {
                const instruments = await Instruments;
                return instruments.find(instrument => instrument.name === val) ? true : false
            },
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
                const midiInstrument = instruments.find(midiInstrument => midiInstrument.name === instrument);
                if (instrument && !midiInstrument) {
                    msg.reply("instrument does not exist!");
                    return;
                }

                // Comnvert the multi-dimensional array of notes to midi binary.
                const midi = new Writer(tracks.map(track => {
                    const t = new Track();
                    const events = Midi[track - 1].map(note => {
                        const noteInstrument = midiInstrument ? midiInstrument : instruments.find(midiInstrument => 
                            midiInstrument.name === note.instrument);
                        return [
                            new ControllerChangeEvent({ controllerNumber: 0, controllerValue: noteInstrument ? noteInstrument.bank : 0 }),
                            new ProgramChangeEvent({ instrument: noteInstrument ? noteInstrument.instrument : 1 }),
                            new NoteEvent({...note, channel: 1})
                        ];
                    }).reduce((a, b) => a.concat(b));
                    t.addEvent(events);
                    return t;
                }));
                const buffer = Buffer.from(midi.buildFile());
        
                // Join the voice channel with the user.
                await msg.member.voiceChannel.leave();
                const connection = await msg.member.voiceChannel.join();
        
                // Spawn a timidity instance to play the MIDI buffer with the specified soundfont.
                const timidity = spawn("timidity", ["-c", `${path}/soundfonts/timidity.cfg`, "-", "-Ow", "-o", "-"]);
                timidity.stdin.write(buffer);
                timidity.stdin.end();
                const dispatcher = connection.playStream(timidity.stdout, { passes: 4, volume: 1, bitrate: 96000 });
        
                // Leave the voice channel and kill the process once done playing.
                dispatcher.on("start", () => msg.reply(`here's your track so far${instrument ? ` using the ${instrument} instrument` : ""}...`));
                dispatcher.on("end", () => {
                    msg.member.voiceChannel.leave();
                    timidity.kill();
                });
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
