import ICommand from "types/command";
import * as commands from "commands";

export const help = {
    name: "help",
    description: "Lists all the available commands",
    run: msg => {
        msg.channel.send({embed: {
            color: 3447003,
            title: "Available Commands",
            fields: Object.values(commands).map(command => {
                const args = command.args ? command.args.reduce((acc, arg) => {
                    return `${acc} ${arg.name}=[]`;
                }, "") : "";
                return {
                    name: command.name + args,
                    value: command.description
                };
            })
        }});
    },
} as ICommand;
