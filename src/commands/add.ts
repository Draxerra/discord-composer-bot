import { NoteEvent } from "midi-writer-js";
import ICommand from "~/types/command";
import Midi from "~/data/midi";

export default {
    name: "add",
    run: (msg, client, args) => {
        const pitch = args[0];
        const duration = args[1] || 128;
        const velocity = args[2] || 80;
        if (pitch) {
            Midi.push(new NoteEvent({ pitch, duration: "T" + duration, velocity }));
            msg.reply(`successfully added ${pitch}, with ${duration} ticks and ${velocity} velocity.`);
        } else {
            msg.reply("you need to specify a note!");
        }
    },
} as ICommand;
