import { GetGeneric, TArgs, TArgValue } from "utils/commands";

export async function ParseArgs<T>(argTypes: T, argValues: string[]) {
    return Object.entries(argTypes).reduce((acc, [name, argType]: [string, TArgs]) => {

        // Find the argument value passed in following the "=".
        const argValue = getValueAfter(argValues.find(val => val.includes(name)) || "", "=");
        // Split the arguments up based on a specified split character.
        const splitValue = argType.splitChar && split(argValue, argType.splitChar);
        // Parse all the values according to the specified type.
        const parsedValue = Array.isArray(splitValue) ? splitValue.map(val => parse(val, argType.type)) : parse(argValue, argType.type);
        // Use the default value if value is blank.
        const defValue = Array.isArray(argType.default) ? argType.default : nullCoalesce(argType.default, "");
        const value = containsBlank(parsedValue) ? defValue : parsedValue;

        // Throw an error if number failed to parse.
        if (containsNaN(parsedValue)) {
            throw new Error(`${name} is invalid!`);
        }

        if (containsBlank(value)) {
            // Throw an error if blank is found in array of args.
            if (containsMoreThanOneElement(value)) {
                throw new Error(`${name} is invalid!`);
            }
            // Throw an error if blank is found and arg is required.
            if (argType.required) {
                throw new Error(`${name} is required!`);
            }
        } else {
            // Throw an error if a value doesn't exist in specified oneOf array.
            if (argType.oneOf && !argType.oneOf(value as any)) {
                throw new Error(`${name} is invalid!`);
            }
            // Only add the value to the acc obj if a value exists.
            acc[name as keyof T] = value as any;
        }
        return acc;
    }, {} as GetGeneric<T>);
};

function parse(val: string, type: StringConstructor | NumberConstructor): string | number {
    return type === Number && val !== "" ? parseInt(val) : val;
}

function getValueAfter(val: string, splitChar: string): string {
    return val.includes(splitChar) ? val.split(splitChar).pop() || "" : "";
}

function split(val: string, splitChar: string): string[] {
    return val.split(splitChar);
}

function containsNaN(val: NonNullable<TArgValue>): boolean {
    const isNaN = (item: string | number) => typeof item === "number" && Number.isNaN(item);
    return Array.isArray(val) ? val.some(isNaN) : isNaN(val);
}

function containsBlank(val: NonNullable<TArgValue>): boolean {
    const isBlank = (item: string | number) => item === "";
    return Array.isArray(val) ? val.some(isBlank) : isBlank(val);
}

function containsMoreThanOneElement(val: TArgValue) {
    return Array.isArray(val) && val.length > 1;
}

function nullCoalesce<T extends string | number | null,K>(val: T | null | undefined, alt: K): T | K {
    return val === undefined || val === null ? alt : val as T;
}