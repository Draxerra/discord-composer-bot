import ICommand from "types/command";
import Soundfonts from "soundfonts";

export const instruments = {
    name: "instruments",
    description: "",
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
