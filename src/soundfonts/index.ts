import { readdir } from "fs";
import { promisify } from "util";

import IFile from "types/file";

export default (async() => {
    const files = await promisify(readdir)(__dirname);
    const soundfonts = files.filter(file => (file.split(/\./g).pop() || "").includes("sf"));
    return soundfonts.map(filename => {
        return {
            filename,
            name: (filename.split(/\.(?=[^.]*$)/).shift() || "").toLowerCase()
        } as IFile;
    });
})();
