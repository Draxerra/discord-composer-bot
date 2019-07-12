import { NoteEvent, Track, Writer } from "midi-writer-js";
import Midi from "data/midi";
import { Arg, Command, ParseArgs } from "utils/commands";
import { Attachment } from "discord.js";
import { exec } from "child_process";
import { readFile, writeFile, unlink } from "fs"; 
import { promisify } from "util";

export const sheet = Command({
    name: "sheet",
    description: "Generates sheet music for the specified tracks (e.g. sheet name=test tracks=1+2)",
    args: {
        name: Arg<string>({
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
        ParseArgs(sheet.args, args).then(async({ name, tracks }) => {
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
                msg.reply("generating sheet music...");

                // Save binary as a temporary midi file.
                const buffer = Buffer.from(midi.buildFile());
                await promisify(writeFile)(`${name}.mid`, buffer);
                
                // Convert the midi to pdf.
                await promisify(exec)(`mscore -d -o '${name}.pdf' '${name}.mid'`);

                // Grab the generated pdf as a buffer.
                const pdf = await promisify(readFile)(`${name}.pdf`);

                // Remove the midi and pdf files.
                await Promise.all([
                    promisify(unlink)(`${name}.pdf`),
                    promisify(unlink)(`${name}.mid`)
                ]);
                
                // Send the file.
                msg.channel.send(new Attachment(pdf, `${name}.pdf`));
            } catch (err) {
                console.error(err);
                msg.reply("oh no! something went wrong :(");
            }
        }).catch(err => {
            msg.reply(err.message);
        });
    }
});
