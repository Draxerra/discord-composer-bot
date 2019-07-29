import * as Discord from "discord.js";
import * as Config from "config.json";
import * as Commands from "commands";
import { generateCfg } from "soundfonts";
import { ParseArgs } from "utils/commands";

const client = new Discord.Client();

client.on("ready", async() => {
    await generateCfg();
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("message", async msg => {
    if (msg.content.startsWith(Config.prefix)) {
        const command = msg.content.replace(Config.prefix, "").trim().split(" ");
        const commandFile = Object.values(Commands).find(file => file.name === command[0]);
        const parsedCommand = command.slice(1).reduce((acc, curr) => {
            const prev = acc[acc.length - 1] || "";
            if (prev.includes("=") && !curr.includes("=")) {
                acc[acc.length - 1] = `${acc[acc.length - 1]} ${curr}`;
            } else {
                acc.push(curr);
            }
            return acc;
        }, [] as string[]);
        if (commandFile) {
            try {
                const parsedArgs = await ParseArgs(commandFile.args, parsedCommand);
                commandFile.run(msg, parsedArgs);
            }
            catch (err) {
                msg.reply(err.message);
            }
        } else {
            msg.reply("invalid command! Type help for a list of commands.");
        }
    }
});

client.login(Config.token);