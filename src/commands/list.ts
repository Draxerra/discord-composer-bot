import { Arg, Command, ParseArgs } from "utils/commands";
import { EmbedPagination } from "utils/pagination";
import Midi, { NotesMap } from "data/midi";
import { Notes } from "midi-writer-js";

const capitalize = (str: string) => {
    return str.replace(/^.|(?<=\s)./g, char => char.toUpperCase());
}

const getNoteNames = (notes: Notes[]) => {
    return notes.map(dur => {
        const note = Object.entries(NotesMap).find(([ key, val ]) => val === dur);
        return note ? capitalize(note[0].replace("-", " ")) : "";
    });
}

export const list = Command({
    name: "list",
    description: "Lists the notes in the specified track (e.g. list track=2)",
    args: {
        track: Arg<number>({
            type: Number,
            default: 1
        })
    },
    run: (msg, client, args) => {
        ParseArgs(list.args, args).then(({ track }) => {
            const selectedTrack = Midi[track - 1];

            // Throw an error if track does not exist.
            if (!selectedTrack) {
                msg.reply("track does not exist!");
                return;
            }

            new EmbedPagination({
                color: 3447003,
                title: `Track ${track}`,
                description: !selectedTrack.length ? "No notes added" : undefined,
                fields: selectedTrack.map((note, j) => {
                    const duration = getNoteNames(note.duration);
                    const wait = getNoteNames(note.wait);
                    return {
                        name: `Note ${j + 1}`,
                        value: `${note.pitch.join("+")} ` +
                        `(Duration: ${duration.join("+")}` +
                        `${wait.length ? `, Wait: ${wait.join("+")}` : ""}, ` +
                        `Velocity: ${note.velocity})`
                    };
                })
            }).send(msg);

        }).catch(err => msg.reply(err.message));
    }
});
