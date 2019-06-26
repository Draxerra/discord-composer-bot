import ICommand from "types/command";
import Soundfonts from "data/soundfonts";

export default {
    name: "instruments",
    run: async(msg) => {
        try {
            const soundfonts = await Soundfonts;
            msg.reply(`Available instruments are: ${soundfonts.map(soundfont => soundfont.name).join(", ")}`);
        } catch (err) {
            console.error(err);
            msg.reply("oh no! something went wrong :(");
        }
    },
} as ICommand;
