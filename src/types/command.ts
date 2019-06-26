import { Client, Message } from "discord.js";

export default interface ICommand {
    name: string;
    description: string;
    run: (msg: Message, client: Client, args: string[]) => void;
}