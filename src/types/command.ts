import { Client, Message } from "discord.js";

export default interface ICommand {
    name: string;
    description: string;
    args?: IArgType[];
    run: (msg: Message, client: Client, args: string[]) => void;
}

export interface IArgType {
    name: string;
    type: StringConstructor | NumberConstructor;
    required?: boolean;
    default?: string | number;
}