import ICommand from "types/command";
import Midi, { addIndex, swapIndex, removeIndex } from "data/midi";
import { parseArgs } from "data/args";
import { NoteEvent } from "midi-writer-js";
import { INote } from "types/track";

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
        const parsedArgs = parseArgs<IEditArgs>(edit.args || [], args);
        if (parsedArgs instanceof Error) {
            msg.reply(parsedArgs.message);
        } else {
            const index = parsedArgs.note - 1;
            const track = parsedArgs.track - 1;
            if (!Midi[track]) {
                msg.reply("invalid track number!");
                return;
            }
            if (!Midi[track].events.some(ev => ev.index === index)) {
                msg.reply("note number does not exist!");
                return;
            }
            const lastIndex = Midi[track].events[Midi[track].events.length-1];
            if (parsedArgs.before !== undefined &&
                (parsedArgs.before - 1 < 1 || parsedArgs.before - 1 > (lastIndex ? lastIndex.index : -1))) {
                msg.reply("cannot move note before this note as it does not exist!");
                return;
            }
            const event = Midi[track].events.filter(ev => ev.index === index).reduce((acc: INote, ev) => {
                if (ev.type === "note-on") {
                    acc.pitch = acc.pitch !== undefined ? `${acc.pitch}+${ev.pitch}` : ev.pitch;
                }
                acc.duration = acc.duration !== undefined ? acc.duration : (ev.duration === undefined ? "T0" : ev.duration);
                acc.velocity = acc.velocity !== undefined ? acc.velocity : (ev.velocity === undefined ? 80 : ev.velocity);
                acc.wait = acc.wait !== undefined ? acc.wait : (ev.wait === undefined ? "T0" : ev.wait);
                return acc;
            }, {} as INote);
            const parsedEvent = {
                duration: parsedArgs.duration !== undefined ? parsedArgs.duration : event.duration,
                pitch: parsedArgs.pitch !== undefined ? parsedArgs.pitch.split("+") : event.pitch.split("+"),
                velocity: parsedArgs.velocity !== undefined ? parsedArgs.velocity : event.velocity,
                wait: parsedArgs.wait !== undefined ? parsedArgs.wait : event.wait,
            };
            Midi[track] = removeIndex(Midi[track], index);
            Midi[track].addEvent(new NoteEvent(parsedEvent));
            Midi[track] = addIndex(Midi[track]);
            if (parsedArgs.before) {
                const lastIndex = Midi[track].events[Midi[track].events.length-1].index;
                Midi[track] = swapIndex(Midi[track], lastIndex, parsedArgs.before - 1);
            }
            msg.reply(`successfully edited note number ${parsedArgs.note} on track number ${parsedArgs.track}.`)
        }
    },
} as ICommand;
