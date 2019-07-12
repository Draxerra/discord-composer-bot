import { Command } from "utils/commands";
import { Instruments } from "soundfonts";

const chunkWords = (str: string[], join: string, maxLength: number): string[] => {
    return str.reduce((acc: string[][], word) => {
        if (acc[acc.length-1].join(join).length + word.length > maxLength) {
            acc.push([]);
        }
        acc[acc.length-1].push(word);
        return acc;
    }, [[]]).map(a => a.join(join));
}

export const instruments = Command({
    name: "instruments",
    description: "Lists all the available instruments",
    args: {},
    run: async(msg) => {
        try {
            const instruments = await Instruments;
            const words = chunkWords(instruments.map(instrument => instrument.name), ", ", 2000);
            words.forEach((wordsStr, i) => {
                msg.channel.send({embed: {
                    title: `List of Instruments${words.length > 1 ? ` (Page ${i+1})`: ""}`,
                    description: wordsStr
                }})
            });
        } catch (err) {
            console.error(err);
            msg.reply("oh no! something went wrong :(");
        }
    }
});
