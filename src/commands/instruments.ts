import { Command } from "utils/commands";
import { DescriptionPagination } from "utils/pagination";
import { Instruments } from "soundfonts";

export const instruments = Command({
    name: "instruments",
    description: "Lists all the available instruments",
    args: {},
    run: async(msg) => {
        try {
            const instruments = await Instruments;
            new DescriptionPagination({
                color: 3447003,
                title: "List of Instruments",
                description: instruments.map(instrument => instrument.name).join(", "),
                wordSeperator: ", "
            }).send(msg);
        } catch (err) {
            console.error(err);
            msg.reply("oh no! something went wrong :(");
        }
    }
});
