import { spawn } from "child_process";
import { NoteEvent, Track, Writer } from "midi-writer-js";
import Midi from "data/midi";
import Soundfonts from "soundfonts";
import ICommand from "types/command";

export const play = {
    name: "play",
    description: "",
    run: async(msg, client, args) => {
        if (!msg.member.voiceChannel) {
            msg.reply("you need to join a voice channel first!");
            return;
        }
        if (!Midi.length) {
            msg.reply("you need to add some notes first!");
            return;
        }
        try {
            const soundfonts = await Soundfonts;
            const soundfont = soundfonts.find(file => file.name === (args[0] || "").toLowerCase()) || soundfonts[0];
            const connection = await msg.member.voiceChannel.join();
    
            const track = new Track();
            track.addEvent(Midi.map(midi => new NoteEvent(midi)));
    
            const writer = new Writer([track]);
            const buffer = Buffer.from(writer.buildFile(), "binary");
    
            const timidity = spawn("timidity", ["-x", `soundfont ./src/soundfonts/${soundfont.filename}`, "-s", "96000", "-", "-Ow", "-o", "-"]);
            timidity.stdin.write(buffer);
            msg.reply(`here's your track so far using the ${soundfont.name} soundfont...`);
            const dispatcher = connection.playStream(timidity.stdout, { passes: 4, volume: 0.8, bitrate: 96000 });
    
            dispatcher.on("end", () => msg.member.voiceChannel.leave());
        } catch (err) {
            console.error(err);
            msg.reply("oh no! something went wrong :(");
        }
    },
} as ICommand;
