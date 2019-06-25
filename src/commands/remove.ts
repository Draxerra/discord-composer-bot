import ICommand from "~/types/command";
import Midi from "~/data/midi";

export default {
    name: "remove",
    run: (msg, client, args) => {
        const removedNote = Midi.splice(parseInt(args[0]) - 1, 1)[0];
        msg.reply(`successfully removed ${removedNote.pitch.join(" ")}!`);
    },
} as ICommand;
