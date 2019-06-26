import ICommand from "types/command";
import * as commands from "commands";

export const help = {
    name: "help",
    description: "",
    run: async(msg) => {
        try {
            const list = Object.values(commands).map(command => command.name);
            msg.reply(list.join(", "));
        } catch (err) {
            console.error(err);
            msg.reply("oh no! Something went wrong. :(");
        }
    },
} as ICommand;
