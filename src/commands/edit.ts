import { Arg, Command } from "utils/commands";
import Midi, { Notes, NotesMap, TDuration } from "data/midi";
import { note } from "@tonaljs/tonal";
import { scale } from "@tonaljs/scale";
import { Instruments } from "soundfonts";

export const edit = Command({
    name: "edit",
    description: "Edits a note",
    args: {
        note: Arg<number>({
            type: Number,
            required: true,
            example: 1
        }),
        track: Arg<number>({
            type: Number,
            required: true,
            example: 2
        }),
        pitch: Arg<string[] | undefined>({
            type: String,
            splitChar: "+",
            oneOf: val => val.every(pitch => note(pitch).name && pitch.match(/\d/g)),
            example: ["c4", "e4", "g4"]
        }),
        duration: Arg<TDuration[] | undefined>({
            type: String,
            splitChar: "+",
            oneOf: val => val.every(duration => Notes.includes(duration)),
            example: ["quarter"]
        }),
        wait: Arg<TDuration[] | undefined>({
            type: String,
            splitChar: "+",
            oneOf: val => val.every(wait => Notes.includes(wait)),
            example: ["whole", "whole"]
        }),
        velocity: Arg<number | undefined>({
            type: Number,
            example: 60
        }),
        instrument: Arg<string>({
            type: String,
            oneOf: async(val) => {
                const instruments = await Instruments;
                return instruments.find(instrument => instrument.name === val) ? true : false
            },
            example: "harmonica"
        }),
        move: Arg<number | undefined>({
            type: Number,
            example: 2
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
    run: (msg, { note, track, move, ...event }) => {
        const selectedTrack = Midi[track - 1];

        // Return an error message if track index does not exist.
        if (!selectedTrack) {
            msg.reply("this track does not exist!");
            return;
        }

        const selectedNote = selectedTrack[note - 1];

        // Return an error message if note index does not exist.
        if (!selectedNote) {
            msg.reply("this note does not exist!");
            return;
        }

        // Alter the values.
        const { pitch, duration, wait, velocity, instrument, tempo, timeSignature, keySignature } = event;
        selectedNote.pitch = pitch !== undefined ? pitch : selectedNote.pitch;
        selectedNote.duration = duration !== undefined ? duration.map(item => NotesMap[item]) : selectedNote.duration;
        selectedNote.wait = wait !== undefined ? wait.map(item => NotesMap[item]) : selectedNote.wait;
        selectedNote.velocity = velocity !== undefined ? velocity : selectedNote.velocity;
        selectedNote.instrument = instrument !== undefined ? instrument : selectedNote.instrument;
        selectedNote.tempo = tempo !== undefined ? tempo : selectedNote.tempo;
        selectedNote.timeSignature = timeSignature ? timeSignature : selectedNote.timeSignature;
        selectedNote.keySignature = keySignature ? keySignature : selectedNote.keySignature;

        if (move !== undefined) {

            // Only move it if the insertion index is between 0 and the last array element.
            if (move - 1 < 0 || move - 1 >= selectedTrack.length) {
                msg.reply("cannot move note here as it does not exist!");
                return;
            }

            // Move the element.
            selectedTrack.splice(move - 1, 0, selectedTrack.splice(note - 1, 1)[0]);
        }

        // Feedback to the user what was edited.
        msg.reply(`Successfully edited note ${note} in track ${track}!`);
    }
});
