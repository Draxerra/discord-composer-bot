import { exec } from "child_process";
import { readdir, writeFile } from "fs";
import { promisify } from "util";

export interface IInstrument {
    bank: number;
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
    return (await Promise.all(soundfonts.map(async(soundfont, i) => {
        const fluidsynth = await promisify(exec)(`echo 'inst 1' | fluidsynth -n ./src/soundfonts/${soundfont}`);
        const insts: IInstrument[] = fluidsynth.stdout.split(/\n/g)
            .filter(val => val.match(/^\d+-\d+ .*$/g))
            .map(val => {
                const [nums, ...name] = val.split(" ");
                const [channel, instrument] = nums.split("-");
                return {
                    bank: i,
                    channel: parseInt(channel) + 1,
                    instrument: parseInt(instrument),
                    name: name.join("-").toLowerCase(),
                    soundfont
                };
            }).filter(val => val.channel === 1);
        if (!insts.length) {
            throw new Error("No instruments defined! This may be an error with fluidsynth.");
        }
        return insts;
    }))).reduce((a, b) => a.concat(b)).filter((instrument, i, instruments) => {
        const j = instruments.findIndex(inst => inst.name === instrument.name);
        return i === j ? true : false;
    });
})();

export const generateCfg = async() => {
    const instruments = await Instruments;
    const banks = instruments.reduce((acc, instrument) => {
        if (!acc[instrument.bank]) {
            acc[instrument.bank] = [];
        }
        acc[instrument.bank].push(instrument);
        return acc;
    }, {} as { [key: number ]: IInstrument[] });
    await promisify(writeFile)("./src/soundfonts/timidity.cfg", `
dir ./src/soundfonts

${Object.entries(banks).map(([bank, instruments]) =>
`bank ${bank}
    ${instruments.map(instrument => `\t${instrument.instrument} %font ./src/soundfonts/${instrument.soundfont} ${instrument.channel - 1} ${instrument.instrument} #${instrument.name}`).join("\n").trim()}
`
).join('\n')}`.trim());

};
