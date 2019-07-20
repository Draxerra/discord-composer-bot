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
        if (commandFile) {
            commandFile.run(msg, client, command.slice(1));
        } else {
            msg.reply("invalid command! Type help for a list of commands.");
        }
    }
});

client.login(Config.token);