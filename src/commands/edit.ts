import ICommand from "types/command";
import Midi, { swapIndex } from "data/midi";
import { toMidi } from "tonal-midi";
import { parseArgs } from "data/args";
import { clone } from "lodash";

interface IEditArgs {
    note: number;
    track: number;
    pitch?: string;
    duration?: number;
    velocity?: number;
    wait?: number;
    before?: number;
}

export const edit = {
    name: "edit",
    description: "Edits a note (e.g. edit note=1 track=2 pitch=e4 duration=256 velocity=30 wait=128 before=1)",
    args: [{
        name: "note",
        type: Number,
        required: true
    }, {
        name: "track",
        type: Number,
        required: true
    }, {
        name: "pitch",
        type: String
    }, {
        name: "duration",
        type: Number
    }, {
        name: "wait",
        type: Number
    }, {
        name: "velocity",
        type: Number
    }, {
        name: "before",
        type: Number
    }],
    run: (msg, client, args) => {
        const parsedArgs = parseArgs<IEditArgs>(edit.args, args);
        if (parsedArgs instanceof Error) {
            msg.reply(parsedArgs.message);
        } else {
            const index = parsedArgs.note - 1;
            const track = parsedArgs.track - 1;
            if (!Midi[track]) {
                msg.reply("invalid track number!");
            }
            Midi[track].events = Midi[track].events.map(ev => {
                if (ev.index === index) {
                    const evClone = clone(ev);
                    evClone.pitch = parsedArgs.pitch ? parsedArgs.pitch : evClone.pitch;
                    evClone.midiNumber = parsedArgs.pitch ? toMidi(parsedArgs.pitch) : evClone.midiNumber;
                    evClone.duration = parsedArgs.duration !== undefined && ev.duration !== null ? "T" + parsedArgs.duration : evClone.duration;
                    evClone.delta = parsedArgs.duration && ev.duration !== null ? parsedArgs.duration : evClone.delta;
                    evClone.wait = parsedArgs.wait !== undefined && typeof ev.wait === "string" ? "T" + parsedArgs.wait : evClone.wait;
                    evClone.velocity = parsedArgs.velocity !== undefined ? parsedArgs.velocity : evClone.velocity;
                    return evClone;
                }
                return ev;
            });
            if (parsedArgs.before) {
                Midi[track] = swapIndex(Midi[track], index, parsedArgs.before - 1);
            }
            msg.reply(`successfully edited note number ${parsedArgs.note} on track number ${parsedArgs.track}.`)
        }
    },
} as ICommand;
