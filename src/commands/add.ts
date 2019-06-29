import ICommand from "types/command";
import Midi, { addIndex, swapIndex } from "data/midi";
import { NoteEvent } from "midi-writer-js";
import { parseArgs } from "data/args";

interface IAddArgs {
    pitch: string;
    duration: number;
    track: number;
    velocity: number;
    wait: number;
    before?: number;
}

export const add = {
    name: "add",
    description: "Adds a note (e.g. add pitch=d4 duration=128 track=2 velocity=40 wait=128 before=2)",
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
        name: "wait",
        type: Number,
        default: 0
    }, {
        name: "velocity",
        type: Number,
        default: 80
    }, {
        name: "before",
        type: Number
    }],
    run: (msg, client, args) => {
        const parsedArgs = parseArgs<IAddArgs>(add.args || [], args);
        if (parsedArgs instanceof Error) {
            msg.reply(parsedArgs.message);
        } else {
            const pitch = parsedArgs.pitch.split("+");
            const track = parsedArgs.track - 1;
            const { before, duration, velocity, wait } = parsedArgs;
            if (!Midi[track]) {
                msg.reply("this track does not exist!");
                return;
            }
            const last = Midi[track].events[Midi[track].events.length-1];
            if (before !== undefined && (before < 1 || before - 1 > (last ? last.index : -1))) {
                msg.reply("cannot move note before this note as it does not exist!");
                return;
            }
            Midi[track].addEvent(new NoteEvent({ pitch, duration: "T" + duration, velocity, wait: "T" + wait }));
            Midi[track] = addIndex(Midi[track]);
            if (before) {
                const lastIndex = Midi[track].events[Midi[track].events.length-1].index;
                Midi[track] = swapIndex(Midi[track], lastIndex, before - 1);
            }
            msg.reply(`successfully added ${parsedArgs.pitch}, with ${duration} ticks, waiting for ${wait} ticks and ${velocity} velocity on track number ${parsedArgs.track}.`);
        }
    },
} as ICommand;
