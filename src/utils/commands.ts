import { Client, Message } from "discord.js";

export type TArgValue = string | number | (string|number)[] | undefined;
export type TArgs = ICommandArg<string> | ICommandArg<number> | ICommandArg<(string|number)[]>;
export type GetGeneric<T> = { [P in keyof T]: T[P] extends ICommandArg<infer K> ? K : never };

export interface ICommand<T> {
    name: string;
    description: string;
    args: T;
    run(msg: Message, client: Client, args: string[]): void;
}

export interface ICommandArgs<T = TArgValue> {
    [key: string]: T;
}

export interface ICommandArg<T> {
    type: StringConstructor | NumberConstructor;
    required?: boolean;
    default?: T | (() => T | Promise<T>);
    splitChar?: string;
    oneOf?: ((val: NonNullable<T>) => boolean | Promise<boolean>);
}

export function Command<T>(command: ICommand<T>) {
    return command;
}

export function Arg<T extends TArgValue = string>(arg: ICommandArg<T>) {
    return arg;
}

export { ParseArgs } from "utils/args";
