import { Command } from "utils/commands";
import { soundfont } from "config.json";

export const instruments = Command({
    name: "instruments",
    description: "Lists all the available instruments",
    args: {},
    run: async(msg) => {
        try {
            msg.channel.send({embed: {
                title: "Instruments",
                description: `The available instruments are: ${soundfont.instruments.map(instrument => instrument.name).join(", ")}`
            }});
        } catch (err) {
            console.error(err);
            msg.reply("oh no! something went wrong :(");
        }
    }
});
