import { spawn } from "child_process";
import { NoteEvent, Track, Writer } from "midi-writer-js";
import Midi from "~/data/midi";
import ICommand from "~/types/command";

export default {
    name: "play",
    run: async(msg, client, args) => {
        if (msg.member.voiceChannel) {
            if (Midi.length) {
                const connection = await msg.member.voiceChannel.join();

                const track = new Track();
                track.addEvent(Midi.map(note => new NoteEvent({pitch: note, duration: "T128", velocity: 100})));
    
                const writer = new Writer([track]);
                const buffer = Buffer.from(writer.buildFile(), "binary");
    
                const timidity = spawn("timidity", ["-x", "soundfont ../soundfonts/SalC5Light2.sf2", "-s", "96000", "-", "-Ow", "-o", "-"]);
                timidity.stdin.write(buffer);
                msg.reply("Here's your track so far...");
                const dispatcher = connection.playStream(timidity.stdout, { passes: 4, volume: 0.8, bitrate: 96000 });
    
                dispatcher.on("end", () => msg.member.voiceChannel.leave());
            } else {
                msg.reply("You need to add some notes first!");
            }
        } else {
            msg.reply("You need to join a voice channel first!");
        }
    },
} as ICommand;
