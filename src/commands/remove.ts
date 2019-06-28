import ICommand from "types/command";
import Midi, { removeIndex } from "data/midi";

export const remove = {
    name: "remove",
    description: "",
    run: (msg, client, args) => {
        const track = parseInt(args[0]) - 1;
        const index = parseInt(args[1]) - 1;
        const notesToRemove = Midi[track].events.filter(ev => ev.index === index && ev.type === "note-on")
            .map(ev => ev.pitch).join("+");
        Midi[track] = removeIndex(Midi[track], index);
        msg.reply(`successfully removed ${index + 1}. ${notesToRemove} from track ${track + 1}!`);
    },
} as ICommand;
