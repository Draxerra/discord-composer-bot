import { NoteEvent, Track, Writer } from "midi-writer-js";
import Midi, { KeySignatureEvent, TempoEvent, TimeSignatureEvent } from "data/midi";
import { path } from "soundfonts";
import { Arg, Command } from "utils/commands";
import { Attachment } from "discord.js";
import { exec } from "child_process";
import { readFile, writeFile, unlink } from "fs"; 
import { promisify } from "util";
import { scale } from "@tonaljs/scale";

export const sheet = Command({
    name: "sheet",
    description: "Generates sheet music for the specified tracks",
    args: {
        name: Arg<string>({
            type: String,
            required: true,
            example: "My MIDI sheet"
        }),
        tracks: Arg<number[]>({
            type: Number,
            default: [1],
            splitChar: "+",
            example: [1, 2]
        }),
        tempo: Arg<number | undefined>({
            type: Number,
            example: 170
        }),
        timeSignature: Arg<number[] | undefined>({
            type: Number,
            splitChar: '/',
            example: [3, 4]
        }),
        keySignature: Arg<string | undefined>({
            type: String,
            oneOf: val => scale(val).notes.length ? true : false,
            example: "C minor"
        }),
    },
    run: async(msg, { name, tracks, tempo, timeSignature, keySignature }) => {
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
                const events = Midi[track - 1].map(note => {
                    const noteTempo = tempo ? tempo : note.tempo;
                    const noteTimeSignature = timeSignature ? timeSignature : note.timeSignature;
                    const noteKeySignature = keySignature ? keySignature : note.keySignature;
                    
                    return [
                        noteTempo ? new TempoEvent(noteTempo) : undefined,
                        noteTimeSignature ? new TimeSignatureEvent(noteTimeSignature[0], noteTimeSignature[1]) : undefined,
                        noteKeySignature ? new KeySignatureEvent(noteKeySignature) : undefined,
                        new NoteEvent(note)
                    ].filter(a => a)
                }).reduce((a, b) => a.concat(b));
                t.addEvent(events);
                return t;
            }));
            msg.reply("generating sheet music...");

            // Save binary as a temporary midi file.
            const buffer = Buffer.from(midi.buildFile());
            await promisify(writeFile)(`${path}/${name}.mid`, buffer);
            
            // Convert the midi to pdf.
            await promisify(exec)(`mscore -d -o '${path}/${name}.pdf' '${path}/${name}.mid'`);

            // Grab the generated pdf as a buffer.
            const pdf = await promisify(readFile)(`${path}/${name}.pdf`);

            // Remove the midi and pdf files.
            await Promise.all([
                promisify(unlink)(`${path}/${name}.pdf`),
                promisify(unlink)(`${path}/${name}.mid`)
            ]);
            
            // Send the file.
            msg.channel.send(new Attachment(pdf, `${name}.pdf`));
        } catch (err) {
            console.error(err);
            msg.reply("oh no! something went wrong :(");
        }
    }
});
