import { Arg, Command, ParseArgs } from "utils/commands";
import Midi from "data/midi";

export const removeTrack = Command({
    name: "remove-track",
    description: "Removes the specified track (e.g. remove-track track=2)",
    args: {
        track: Arg<number>({
            type: Number,
            required: true
        })
    },
    run: (msg, client, args) => {
        ParseArgs(removeTrack.args, args).then(({ track }) => {
            const trackIndex = track - 1;

            // Throw an error if track does not exist.
            if (!Midi[trackIndex]) {
                msg.reply("this track does not exist!");
                return;
            }

            Midi.splice(trackIndex, 1);
            msg.reply(`Successfully removed track number ${track}!`);
        }).catch(err => msg.reply(err.message));
    }
});
