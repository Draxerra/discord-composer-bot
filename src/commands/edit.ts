import { Arg, Command, ParseArgs } from "utils/commands";
import Midi, { Notes, NotesMap, TDuration } from "data/midi";
import { note } from "@tonaljs/tonal";

export const edit = Command({
    name: "edit",
    description: "Edits a note (e.g. edit note=1 track=2 pitch=e4 duration=256 velocity=30 wait=128 move=1)",
    args: {
        note: Arg<number>({
            type: Number,
            required: true
        }),
        track: Arg<number>({
            type: Number,
            required: true
        }),
        pitch: Arg<string[] | undefined>({
            type: String,
            splitChar: "+",
            oneOf: val => val.every(pitch => note(pitch).name)
        }),
        duration: Arg<TDuration[] | undefined>({
            type: String,
            splitChar: "+",
            oneOf: val => val.every(duration => Notes.includes(duration))
        }),
        wait: Arg<TDuration[] | undefined>({
            type: String,
            splitChar: "+",
            oneOf: val => val.every(wait => Notes.includes(wait)),
        }),
        velocity: Arg<number | undefined>({
            type: Number
        }),
        move: Arg<number | undefined>({
            type: Number
        })
    },
    run: (msg, client, args) => {
        ParseArgs(edit.args, args).then(({ note, track, move, ...event }) => {
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
            const { pitch, duration, wait, velocity } = event;
            selectedNote.pitch = pitch !== undefined ? pitch : selectedNote.pitch;
            selectedNote.duration = duration !== undefined ? duration.map(item => NotesMap[item]) : selectedNote.duration;
            selectedNote.wait = wait !== undefined ? wait.map(item => NotesMap[item]) : selectedNote.wait;
            selectedNote.velocity = velocity !== undefined ? velocity : selectedNote.velocity;

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

        }).catch(err => msg.reply(err.message));
    }
});
