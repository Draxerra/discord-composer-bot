import { spawn } from "child_process";
import { Writer } from "midi-writer-js";
import Midi from "data/midi";
import Soundfonts from "soundfonts";
import ICommand from "types/command";
import { parseArgs } from "data/args";

interface IPlayArgs {
    instrument: string;
    tracks: string;
}

export const play = {
    name: "play",
    description: "Plays the specified tracks (e.g. play instrument=guitar tracks=1+2)",
    args: [{
        name: "instrument",
        type: String,
        default: "piano"
    }, {
        name: "tracks",
        type: String,
        default: "1"
    }],
    run: async(msg, client, args) => {
        const parsedArgs = parseArgs<IPlayArgs>(play.args, args);
        if (parsedArgs instanceof Error) {
            msg.reply(parsedArgs.message);
            return;
        }
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
            const soundfont = soundfonts.find(file => file.name === parsedArgs.instrument.toLowerCase());
            const connection = await msg.member.voiceChannel.join();

            const writer = new Writer(Midi);
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
