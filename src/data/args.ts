import { IArgType } from "types/command";

export function parseArgs<T>(argTypes: IArgType[], argValues: string[]): T | Error {
    try {
        return argTypes.reduce((acc, argType) => {
            const argValue = argValues.find(argValue => argValue.includes(argType.name));
            if (argValue) {
                const val = argValue.split("=").pop();
                const parsedVal = argType.type === Number ? parseInt(val) : val;
                if (parsedVal !== undefined) {
                    acc[argType.name] = parsedVal;
                }
            } else if (argType.default !== undefined) {
                acc[argType.name] = argType.default;
            } else if (argType.required) {
                throw new Error(`you must specify a ${argType.name}!`);
            }
            return acc;
        }, {} as T);
    } catch (err) {
        return err;
    }
}
