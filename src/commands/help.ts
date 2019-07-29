import { Command } from "utils/commands";
import * as commands from "commands";
import { EmbedPagination } from "utils/pagination";
import { ICommandArgs, ICommandArg, TArgValue } from "utils/commands";
import { prefix } from "config.json";

export const help = Command({
    name: "help",
    description: "Lists all the available commands",
    args: {},
    run: msg => {
        new EmbedPagination({
            color: 3447003,
            title: "Available Commands",
            fields: Object.values(commands).map(command => {
                const args = Object.keys(command.args).reduce((acc, arg) => {
                    return `${acc} ${arg}=[]`;
                }, "");
                const examples = Object.entries(command.args as ICommandArgs<ICommandArg<TArgValue>>).reduce((acc, [arg, {example, splitChar}]) => {
                    const parsedExample = Array.isArray(example) ? example.join(splitChar) : (example || "").toString();
                    return `${acc} ${arg}=${parsedExample}`;
                }, "");
                return {
                    name: command.name + args || "N/A",
                    value: command.description ? `${command.description} (e.g. ${prefix}${command.name}${examples})` : "N/A"
                };
            })
        }).send(msg);
    }
});
