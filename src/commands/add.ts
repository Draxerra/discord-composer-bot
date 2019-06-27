import ICommand from "types/command";
import Midi from "data/midi";
import { NoteEvent } from "midi-writer-js";

export const add = {
    name: "add",
    description: "",
    run: (msg, client, args) => {
        const pitch = args[0];
        const duration = args[1] || 128;
        const trackIndex = parseInt(args[2]) - 1 || 0;
        const velocity = parseInt(args[3] || "80");
        if (!Midi[trackIndex]) {
            msg.reply("This track does not exist!");
        }
        if (pitch) {
            Midi[trackIndex].addEvent(new NoteEvent({ pitch: [pitch], duration: "T" + duration, velocity }));
            const events = Midi[trackIndex].events.filter(ev => ev.index !== undefined);
            const lastIndex = events.length ? events[events.length - 1].index : -1;
            Midi[trackIndex].events = Midi[trackIndex].events.map(event => {
                event.index = event.index !== undefined ? event.index : lastIndex + 1;
                return event;
            });
            msg.reply(`successfully added ${pitch}, with ${duration} ticks and ${velocity} velocity on track number ${trackIndex + 1}.`);
        } else {
            msg.reply("you need to specify a note!");
        }
    },
} as ICommand;
