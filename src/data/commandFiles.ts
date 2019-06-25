import { readdir } from "fs";
import { promisify } from "util";

import ICommand from "~/types/command";
import ICommandFile from "~/types/commandFile";

export default (async() => {
    const files = await promisify(readdir)("./src/commands");
    return Promise.all(files.map(async(file) => {
        const commandFile = (await import("~/commands/" + file)).default as ICommand;
        return {
            filename: file,
            name: commandFile.name,
        } as ICommandFile;
    }));
})();
