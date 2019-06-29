import { IArgType } from "types/command";

export function parseArgs<T>(argTypes: IArgType[], argValues: string[]): T | Error {
    try {
        return argTypes.reduce((acc, argType) => {
            const argValue = argValues.find(argValue => argValue.includes(argType.name));
            if (argValue) {
                const val = argValue.split("=").pop();
                const parsedVal = argType.type === Number ? parseInt(val) : val;
                if (typeof parsedVal === "number" && Number.isNaN(parsedVal)) {
                    throw new Error(`you must specify a valid ${argType.name}!`);
                }
                if (typeof parsedVal === "string" && !Number.isNaN(parseInt(val))) {
                    throw new Error(`you must specify a valid ${argType.name}!`);
                }
                if (typeof parsedVal === "string" || typeof parsedVal === "number") {
                    acc[argType.name] = parsedVal;
                }
            } else if (argType.default !== undefined) {
                acc[argType.name] = argType.default;
            }
            if (argType.required && acc[argType.name] === undefined) {
                throw new Error(`you must specify a ${argType.name}!`);
            }
            return acc;
        }, {} as T);
    } catch (err) {
        return err;
    }
}
