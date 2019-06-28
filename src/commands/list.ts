import ICommand from "types/command";
import Midi from "data/midi";
import { INoteEvent } from "types/track";

export const list = {
    name: "list",
    description: "Lists the current tracks",
    run: (msg) => {
        if (Midi.length) {
            Midi.map((track, i) => {
                const notes = track.events.reduce((acc: INoteEvent[], note) => {
                    if (!acc[note.index]) {
                        acc[note.index] = {...note};
                    } else if (acc[note.index].type === note.type) {
                        acc[note.index].pitch = `${acc[note.index].pitch}+${note.pitch}`;
                    }
                    if(note.type === "note-off" && acc[note.index].duration === undefined) {
                        acc[note.index].duration = note.duration;
                    } else if (note.type === "note-on" && acc[note.index].wait === null) {
                        acc[note.index].wait = note.wait;
                    }
                    return acc;
                }, []);
                return {
                    embed: {
                        color: 3447003,
                        title: `Track ${i+1}`,
                        description: !notes.length ? "No notes added" : undefined,
                        fields: notes.map((note, j) => ({
                            name: `Note ${j+1}`,
                            value: `${note.pitch} (Duration: ${note.duration.slice(1)}, Wait: ${note.wait.slice(1)}, Velocity: ${note.velocity})`
                        }))
                    }
                };
            }).forEach(embed => msg.channel.send(embed));
        } else {
            msg.reply("there are no notes added!");
        }
    },
} as ICommand;
