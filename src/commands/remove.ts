import ICommand from "types/command";
import Midi, { removeIndex } from "data/midi";
import { parseArgs } from "data/args";

interface IRemoveArgs {
    track: number;
    note: number;
}

export const remove = {
    name: "remove",
    description: "Removes a note (e.g. remove note=3 track=2)",
    args: [{
        name: "note",
        type: Number,
        required: true
    }, {
        name: "track",
        type: Number,
        required: true
    }],
    run: (msg, client, args) => {
        const parsedArgs = parseArgs<IRemoveArgs>(remove.args, args);
        if (parsedArgs instanceof Error) {
            msg.reply(parsedArgs);
        } else {
            const index = parsedArgs.note - 1;
            const track = parsedArgs.track - 1;
            if (!Midi[track]) {
                msg.reply("invalid track number!");
            }
            const notesToRemove = Midi[track].events.filter(ev => ev.index === index && ev.type === "note-on")
                .map(ev => ev.pitch).join("+");
            Midi[track] = removeIndex(Midi[track], index);
            msg.reply(`successfully removed ${parsedArgs.note}. ${notesToRemove} from track ${parsedArgs.track}!`);
        }
    },
} as ICommand;
