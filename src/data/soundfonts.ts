import { readdir } from "fs";
import { promisify } from "util";

export default (async() => {
    const files = await promisify(readdir)("./src/soundfonts");
    return files.filter(file => file.split(/\./g).pop().includes("sf"));
})();
