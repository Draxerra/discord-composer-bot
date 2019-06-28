import ICommand from "types/command";
import Midi, { removeIndex } from "data/midi";
import { parseArgs } from "data/args";

interface IRemoveArgs {
    track: number;
    number: number;
}

export const remove = {
    name: "remove",
    description: "Removes a note (e.g. remove track=2 number=3)",
    args: [{
        name: "track",
        type: Number,
        required: true
    }, {
        name: "number",
        type: Number,
        required: true
    }],
    run: (msg, client, args) => {
        const parsedArgs = parseArgs<IRemoveArgs>(remove.args, args);
        if (parsedArgs instanceof Error) {
            msg.reply(parsedArgs);
        } else {
            const index = parsedArgs.number - 1;
            const track = parsedArgs.track - 1;
            const notesToRemove = Midi[track].events.filter(ev => ev.index === index && ev.type === "note-on")
                .map(ev => ev.pitch).join("+");
            Midi[track] = removeIndex(Midi[track], index);
            msg.reply(`successfully removed ${parsedArgs.number}. ${notesToRemove} from track ${parsedArgs.track}!`);
        }
    },
} as ICommand;
