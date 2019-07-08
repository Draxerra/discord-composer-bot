import { Command } from "utils/commands";
import Soundfonts from "soundfonts";

export const instruments = Command({
    name: "instruments",
    description: "Lists all the available instruments",
    args: {},
    run: async(msg) => {
        try {
            const soundfonts = await Soundfonts;
            msg.reply(`Available instruments are: ${soundfonts.map(soundfont => soundfont.name).join(", ")}`);
        } catch (err) {
            console.error(err);
            msg.reply("oh no! something went wrong :(");
        }
    }
});
