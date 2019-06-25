import ICommand from "~/types/command";
import Midi from "~/data/midi";

export default {
    name: "list",
    run: (msg, client, args) => {
        if (Midi.length) {
            msg.reply(Midi.map((note, i) => `${i+1}. ${note.pitch.join("+")}`));
        } else {
            msg.reply("there are no notes added!");
        }
    },
} as ICommand;
