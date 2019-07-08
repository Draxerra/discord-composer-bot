import { Command } from "utils/commands";
import * as commands from "commands";

export const help = Command({
    name: "help",
    description: "Lists all the available commands",
    args: {},
    run: msg => {
        msg.channel.send({embed: {
            color: 3447003,
            title: "Available Commands",
            fields: Object.values(commands).map(command => {
                const args = Object.keys(command.args).reduce((acc, arg) => {
                    return `${acc} ${arg}=[]`;
                }, "");
                return {
                    name: command.name + args || "N/A",
                    value: command.description || "N/A"
                };
            })
        }});
    }
});
