import { Command } from "utils/commands";
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
    description: "Lists the current tracks",
    args: {},
    run: msg => {
        // Throw an error if there are no tracks.
        if (!Midi.length) {
            msg.reply("there are no tracks added!");
            return;
        }

        Midi.map((track, i) => {
            return {
                embed: {
                    color: 3447003,
                    title: `Track ${i + 1}`,
                    description: !track.length ? "No notes added" : undefined,
                    fields: track.map((note, j) => {
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
                }
            }
        }).forEach(embed => msg.channel.send(embed));
    }
});
