import { Track } from "midi-writer-js";
import ICommand from "types/command";
import Midi from "data/midi";

export const addTrack = {
    name: "add-track",
    description: "",
    run: (msg, client, args) => {
        Midi.push(new Track());
        msg.reply(`Added track no. ${Midi.length}!`);
    },
} as ICommand;
