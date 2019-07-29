import { Arg, Command } from "utils/commands";
import Midi from "data/midi";

export const removeTrack = Command({
    name: "remove-track",
    description: "Removes the specified track",
    args: {
        track: Arg<number>({
            type: Number,
            required: true,
            example: 2
        })
    },
    run: (msg, { track }) => {
        const trackIndex = track - 1;

        // Throw an error if track does not exist.
        if (!Midi[trackIndex]) {
            msg.reply("this track does not exist!");
            return;
        }

        Midi.splice(trackIndex, 1);
        msg.reply(`Successfully removed track number ${track}!`);
    }
});
