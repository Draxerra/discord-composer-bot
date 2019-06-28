import ICommand from "types/command";
import Midi, { addIndex } from "data/midi";
import { NoteEvent } from "midi-writer-js";
import { parseArgs } from "data/args";

interface IAddArgs {
    pitch: string;
    duration: number;
    track: number;
    velocity: number;
}

export const add = {
    name: "add",
    description: "Adds a note (e.g. add pitch=d4 duration=128 track=2 velocity=40)",
    args: [{
        name: "pitch",
        type: String,
        required: true
    }, {
        name: "duration",
        type: Number,
        default: 128
    }, {
        name: "track",
        type: Number,
        default: 1
    }, {
        name: "velocity",
        type: Number,
        default: 80
    }],
    run: (msg, client, args) => {
        const parsedArgs = parseArgs<IAddArgs>(add.args, args);
        if (parsedArgs instanceof Error) {
            msg.reply(parsedArgs.message);
        } else {
            const pitch = parsedArgs.pitch.split("+");
            const track = parsedArgs.track - 1;
            const { duration, velocity } = parsedArgs;
            if (!Midi[track]) {
                msg.reply("this track does not exist!");
            }
            if (pitch) {
                Midi[track].addEvent(new NoteEvent({ pitch, duration: "T" + duration, velocity }));
                Midi[track] = addIndex(Midi[track]);
                msg.reply(`successfully added ${parsedArgs.pitch}, with ${duration} ticks and ${velocity} velocity on track number ${parsedArgs.track}.`);
            } else {
                msg.reply("you need to specify a note!");
            }
        }
    },
} as ICommand;
