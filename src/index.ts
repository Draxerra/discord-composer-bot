import * as Discord from "discord.js";
import * as Config from "../config.json";

import CommandFiles from "~/data/commandFiles";
import ICommand from "~/types/command";

const client = new Discord.Client();

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("message", async msg => {
    if (msg.content.startsWith(Config.prefix)) {
        try {
            const commandFiles = await CommandFiles;
            const command = msg.content.replace(Config.prefix, "").trim().split(" ");
            const commandFile = commandFiles.find(file => file.name === command[0]);
            if (commandFile) {
                const file = (await import("./commands/" + commandFile.filename)).default as ICommand;
                file.run(msg, client, command.slice(1));
            } else {
                msg.reply("Invalid command! Type help for a list of commands.");
            }
        } catch (err) {
            msg.reply("Oh no! Something went wrong! :(");
        }
    }
});

client.login(Config.token);