import ICommand from "types/command";
import Midi from "data/midi";
import { INoteEvent } from "types/track";

export const list = {
    name: "list",
    description: "Lists the current tracks",
    run: (msg) => {
        if (Midi.length) {
            const notesStr = Midi.reduce((acc, track, i) => {
                const notes = track.events.filter(note => note.type === "note-on").reduce((acc: INoteEvent[], note) => {
                    if (!acc[note.index]) {
                        acc[note.index] = {...note};
                    } else {
                        acc[note.index].pitch = `${acc[note.index].pitch}+${note.pitch}`;
                    }
                    return acc;
                }, []).reduce((acc, note) => {
                    return acc + `${note.index + 1}. ${note.pitch} `;
                }, "").trim();
                return acc + `Track ${i+1}. ${notes}`;
            }, "");
            msg.reply(notesStr);
        } else {
            msg.reply("there are no notes added!");
        }
    },
} as ICommand;
