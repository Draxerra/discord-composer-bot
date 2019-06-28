import ICommand from "types/command";
import Midi, { addIndex } from "data/midi";
import { NoteEvent } from "midi-writer-js";

export const add = {
    name: "add",
    description: "",
    run: (msg, client, args) => {
        const pitch = args[0].split("+");
        const duration = args[1] || 128;
        const trackIndex = parseInt(args[2]) - 1 || 0;
        const velocity = parseInt(args[3] || "80");
        if (!Midi[trackIndex]) {
            msg.reply("This track does not exist!");
        }
        if (pitch) {
            Midi[trackIndex].addEvent(new NoteEvent({ pitch, duration: "T" + duration, velocity }));
            Midi[trackIndex] = addIndex(Midi[trackIndex]);
            msg.reply(`successfully added ${pitch.join("+")}, with ${duration} ticks and ${velocity} velocity on track number ${trackIndex + 1}.`);
        } else {
            msg.reply("you need to specify a note!");
        }
    },
} as ICommand;
