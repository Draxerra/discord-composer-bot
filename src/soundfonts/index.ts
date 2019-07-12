import { spawn } from "child_process";
import { readdir } from "fs";
import { promisify } from "util";

export interface IInstrument {
    channel: number;
    instrument: number;
    name: string;
    soundfont: string;
}

const getSoundfonts = (async() => {
    const files = await promisify(readdir)(__dirname);
    return files.filter(file => (file.split(/\./g).pop() || "").includes("sf"));
})();

export const Instruments = (async() => {
    const soundfonts = await getSoundfonts;
    return (await Promise.all(soundfonts.map(soundfont => {
        return new Promise<IInstrument[]>((resolve, reject) => {
            const data: IInstrument[] = [];
            const fluidsynth = spawn("fluidsynth", ['-s', `./src/soundfonts/${soundfont}`]);
            fluidsynth.stdin.setDefaultEncoding("utf-8");
            fluidsynth.stdout.setEncoding("utf-8");
            fluidsynth.stdin.write("inst 1");
            fluidsynth.stdin.end();
            fluidsynth.stdin.on("error", reject);
            fluidsynth.stdout.on("error", reject);
            fluidsynth.stdout.on("data", (d: string) => {
                const insts = d.split(/\n/g)
                    .filter(val => val.match(/^\d+-\d+ .*$/g))
                    .map(val => {
                        const [nums, ...name] = val.split(" ");
                        const [channel, instrument] = nums.split("-");
                        return {
                            channel: parseInt(channel) + 1,
                            instrument: parseInt(instrument),
                            name: name.join("-").toLowerCase(),
                            soundfont
                        };
                    });
                data.push(...insts);
            });
            fluidsynth.stdout.on("end", () => resolve(data));
        });
    }))).reduce((a, b) => a.concat(b)).filter((instrument, i, instruments) => {
        const j = instruments.findIndex(inst => inst.name === instrument.name);
        return i === j ? true : false;
    });
})();
