import ICommand from "types/command";
import CommandFiles from "data/commandFiles";

export default {
    name: "help",
    run: async(msg) => {
        try {
            const commandFiles = await CommandFiles;
            msg.reply(commandFiles.map(commandFile => commandFile.name).join(", "));
        } catch (err) {
            console.error(err);
            msg.reply("oh no! Something went wrong. :(");
        }
    },
} as ICommand;
