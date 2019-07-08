import { Command } from "utils/commands";
import { Notes } from "data/midi";

export const notes = Command({
    name: "notes",
    description: "Shows all the notes",
    args: {},
    run: msg => {
        msg.channel.send({embed: {
            color: 3447003,
            title: "Notes",
            description: `The available notes are: ${Notes.reduce((acc, note, i) => {
                return `${acc}${i === Notes.length - 1 ? ' and ' : acc ? ', ' : ''}${note}`;
            }, "")}`
        }})
    }
});
