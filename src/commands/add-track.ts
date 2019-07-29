import { Command } from "utils/commands";
import Midi from "data/midi";

export const addTrack = Command({
    name: "add-track",
    description: "Adds a new track",
    args: {},
    run: msg => {
        Midi.push([]);
        msg.reply(`Added track no. ${Midi.length}!`);
    },
});
