import ICommand from "types/command";
import Midi from "data/midi";

export const remove = {
    name: "remove",
    description: "",
    run: (msg, client, args) => {
        const removedNote = Midi.splice(parseInt(args[0]) - 1, 1)[0];
        msg.reply(`successfully removed ${removedNote.pitch.join(" ")}!`);
    },
} as ICommand;
