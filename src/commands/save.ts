import { NoteEvent, Track, Writer } from "midi-writer-js";
import Midi from "data/midi";
import { Arg, Command, ParseArgs } from "utils/commands";
import { Attachment } from "discord.js";

export const save = Command({
    name: "save",
    description: "Saves the specified tracks as a MIDI file (e.g. play instrument=guitar tracks=1+2)",
    args: {
        filename: Arg<string>({
            type: String,
            required: true
        }),
        tracks: Arg<number[]>({
            type: Number,
            default: [1],
            splitChar: "+"
        })
    },
    run: (msg, client, args) => {
        ParseArgs(save.args, args).then(async({ filename, tracks }) => {
            try {
                // Throw an error if any tracks specified to be played are empty.
                const indexes = tracks.filter(track => !(Midi[track - 1] && Midi[track-1].length));
                if (indexes.length) {
                    msg.reply(`you need to add some notes to track${indexes.length > 1 ? "s" : ""} ${indexes.join("+")}!`);
                    return;
                }

                // Comnvert the multi-dimensional array of notes to midi binary.
                const midi = new Writer(tracks.map(track => {
                    const t = new Track();
                    t.addEvent(Midi[track - 1].map(note => new NoteEvent(note)));
                    return t;
                }));
                const buffer = Buffer.from(midi.buildFile(), "binary");
                
                // Send the file.
                msg.channel.send(new Attachment(buffer, `${filename}.mid`));
            } catch (err) {
                console.error(err);
                msg.reply("oh no! something went wrong :(");
            }
        }).catch(err => {
            msg.reply(err.message);
        });
    }
});
