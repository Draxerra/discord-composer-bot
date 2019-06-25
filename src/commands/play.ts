import { spawn } from "child_process";
import { Track, Writer } from "midi-writer-js";
import Midi from "~/data/midi";
import Soundfonts from "~/data/soundfonts";
import ICommand from "~/types/command";

export default {
    name: "play",
    run: async(msg, client, args) => {
        if (msg.member.voiceChannel) {
            if (Midi.length) {
                const soundfonts = await Soundfonts;
                const soundfont = args[0] || soundfonts[0];
                const connection = await msg.member.voiceChannel.join();

                const track = new Track();
                track.addEvent(Midi);
    
                const writer = new Writer([track]);
                const buffer = Buffer.from(writer.buildFile(), "binary");
    
                const timidity = spawn("timidity", ["-x", `soundfont ../soundfonts/${soundfont}`, "-s", "96000", "-", "-Ow", "-o", "-"]);
                timidity.stdin.write(buffer);
                msg.reply(`here's your track so far using the ${soundfont} soundfont...`);
                const dispatcher = connection.playStream(timidity.stdout, { passes: 4, volume: 0.8, bitrate: 96000 });
    
                dispatcher.on("end", () => msg.member.voiceChannel.leave());
            } else {
                msg.reply("you need to add some notes first!");
            }
        } else {
            msg.reply("you need to join a voice channel first!");
        }
    },
} as ICommand;
