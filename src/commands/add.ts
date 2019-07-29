import { Arg, Command } from "utils/commands";
import Midi, { TDuration, Notes, NotesMap } from "data/midi";
import { note } from "@tonaljs/tonal";
import { scale } from "@tonaljs/scale";
import { IExtendedNoteEvent } from "data/midi";
import { Instruments } from "soundfonts";

const precedesVowel = (val: string) => ["a", "e", "i", "o", "u"].includes(val.charAt(0));

export const add = Command({
    name: "add",
    description: "Adds a note",
    args: {
        pitch: Arg<string[]>({
            type: String,
            required: true,
            splitChar: "+",
            oneOf: val => val.every(pitch => note(pitch).name && pitch.match(/\d/g)),
            example: ["c4", "e4", "g4"]
        }),
        duration: Arg<TDuration[]>({
            type: String,
            default: ["quarter"],
            splitChar: "+",
            oneOf: val => val.every(duration => Notes.includes(duration)),
            example: ["quarter"]
        }),
        track: Arg<number>({
            type: Number,
            default: 1,
            example: 2
        }),
        wait: Arg<TDuration[]>({
            type: String,
            default: ["none"],
            splitChar: "+",
            oneOf: val => val.every(wait => Notes.includes(wait)),
            example: ["whole", "whole"]
        }),
        velocity: Arg<number>({
            type: Number,
            default: 80,
            example: 60
        }),
        instrument: Arg<string>({
            type: String,
            oneOf: async(val) => {
                const instruments = await Instruments;
                return instruments.find(instrument => instrument.name === val) ? true : false
            },
            default: async() => {
                const instruments = await Instruments;
                return instruments[0] ? instruments[0].name : "";
            },
            example: "harmonica"
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
        before: Arg<number | undefined>({
            type: Number,
            example: 1
        })
    },
    run: async(msg, {pitch, duration, track, wait, velocity, instrument, before, timeSignature, keySignature, tempo }) => {
        const selectedTrack = Midi[track - 1];
        const mappedDuration = duration.map(item => NotesMap[item]);
        const mappedWait = wait.filter(item => item !== "none").map(item => NotesMap[item]);

        // Return an error message if track index does not exist.
        if (!selectedTrack) {
            msg.reply("this track does not exist!");
            return;
        }

        // Add the note to the selectedTrack array.
        const trackNote: IExtendedNoteEvent = {
            pitch,
            duration: mappedDuration,
            wait: mappedWait,
            instrument,
            velocity,
            keySignature,
            timeSignature,
            tempo
        };

        // Insertion index specified.
        if (before !== undefined) {
            
            // Only add it to the array if the insertion index is between 0 and the last array element.
            if (before - 1 < 0 || before - 1 >= selectedTrack.length) {
                msg.reply("cannot insert note before specified note as it does not exist!");
                return;
            } else {
                selectedTrack.splice(before - 1, 0, trackNote);
            }

        // No insertion index specified.
        // Push it to the end of the array.
        } else {
            selectedTrack.push(trackNote);
        }

        // Feedback to the user what was added.
        msg.reply(`Successfully added ${precedesVowel(duration.join()) ? "an" : "a"} ${duration.join("+")}` +
            ` ${pitch.join("+")} note (` +
            `${mappedWait.length ? `Rest: ${wait.join("+")}, ` : ""}` +
            `Velocity: ${velocity}, ` +
            `Instrument: ${instrument}` +
            `${timeSignature ? `, Time Signature Change: ${timeSignature.join('/')}` : ""}` +
            `${keySignature ? `, Key Signature Change: ${keySignature}` : ""}` +
            `${tempo ? `, Tempo Change: ${tempo}` : ""}` +
            `) to track ${track}!`);
    }
});
