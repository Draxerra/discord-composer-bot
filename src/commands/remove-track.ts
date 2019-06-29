import ICommand from "types/command";
import Midi from "data/midi";
import { parseArgs } from "data/args";

interface IRemoveTrackArgs {
    track: number;
}

export const removeTrack = {
    name: "remove-track",
    description: "Removes the specified track (e.g. remove-track track=2)",
    args: [{
        name: "track",
        type: Number,
        required: true
    }],
    run: (msg, client, args) => {
        const parsedArgs = parseArgs<IRemoveTrackArgs>(removeTrack.args || [], args);
        if (parsedArgs instanceof Error) {
            msg.reply(parsedArgs);
        } else {
            const track = parsedArgs.track - 1;
            if (!Midi[track]) {
                msg.reply("invalid track number!");
                return;
            }
            Midi.splice(track, 1);
            msg.reply(`Removed track no. ${parsedArgs.track}!`);
        }
    },
} as ICommand;
