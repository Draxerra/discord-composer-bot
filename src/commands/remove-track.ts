import ICommand from "types/command";
import Midi from "data/midi";

export const removeTrack = {
    name: "remove-track",
    description: "",
    run: (msg, client, args) => {
        Midi.splice(parseInt(args[0]), 1);
    },
} as ICommand;
