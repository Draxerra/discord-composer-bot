import * as Discord from "discord.js";
import * as Config from "config.json";
import * as Commands from "commands";
import { generateCfg } from "soundfonts";

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
            commandFile.run(msg, client, parsedCommand);
        } else {
            msg.reply("invalid command! Type help for a list of commands.");
        }
    }
});

client.login(Config.token);