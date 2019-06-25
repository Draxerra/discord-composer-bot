import ICommand from "~/types/command";
import Midi from "~/data/midi";

export default {
    name: "add",
    run: (msg, client, args) => {
        Midi.push(args[0]);
        msg.reply(`Successfully added ${args[0]}!`);
    },
} as ICommand;
