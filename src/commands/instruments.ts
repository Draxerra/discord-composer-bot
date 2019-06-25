import ICommand from "~/types/command";
import Soundfonts from "~/data/soundfonts";

export default {
    name: "instruments",
    run: async(msg) => {
        const soundfonts = await Soundfonts;
        msg.reply(`Available instruments are: ${soundfonts.join(", ")}`);
    },
} as ICommand;
