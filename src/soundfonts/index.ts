import { exec } from "child_process";
import { readdir, writeFile } from "fs";
import { promisify } from "util";

export interface IInstrument {
    origBank: number;
    bank: number;
    origProgram: number;
    program: number;
    name: string;
    soundfont: string;
}

export const path = process.env.NODE_ENV === "production" ? "./dist" : "./src";

const getSoundfonts = (async() => {
    const files = await promisify(readdir)(`${path}/soundfonts`);
    return files.filter(file => (file.split(/\./g).pop() || "").includes("sf"));
})();

export const Instruments = (async() => {
    const soundfonts = await getSoundfonts;
    return (await Promise.all(soundfonts.map(async(soundfont, i) => {
        // Use fluidsynth to get the list of instruments from the soundfonts.
        const fluidsynth = await promisify(exec)(`echo 'inst 1' | fluidsynth -n ${path}/soundfonts/'${soundfont}'`);

        // Split the output into an array from new lines
        const insts = fluidsynth.stdout.split(/\n/g)

            // Filter out anything that doesn't follow the pattern ddd-ddd (e.g. 000-000)
            .filter(val => val.match(/^\d+-\d+ .*$/g))

            // Parse the values into an object containing the bank, program, name and soundfont for each instrument
            .map(val => {
                const [nums, ...name] = val.split(" ");
                const [bank, program] = nums.split("-");

                const parsedBank = parseInt(bank);
                const parsedProgram = parseInt(program);

                return {
                    bank: parsedBank,
                    program: parsedProgram,
                    name: name.join("-").toLowerCase(),
                    soundfont
                };
            })

            // Filter out any duplicate names
            .filter((instrument, i, instruments) => {
                const j = instruments.findIndex(inst => inst.name === instrument.name);
                return i === j ? true : false;
            });
        
        // Throw an error if array is empty
        if (!insts.length) {
            throw new Error("No instruments defined! This may be an error with fluidsynth.");
        }
        return insts;
    
    // Flatten all of the soundfonts into one array
    }))).reduce((a, b) => a.concat(b))

        // When multiple soundfonts are used, the same program/bank number might be output from fluidsynth
        // So, calculate a new bank/program number for each of them to map to
        .reduce((acc, { bank, program, name, soundfont }) => {
            const prev = acc[acc.length - 1];

            const timidityProgram = prev ? prev.program : -1;
            const timidityBank = prev ? prev.bank : 0;
            // Filter out channels less than 128 as they are currently not supported
            return bank < 128 ? acc.concat({
                origBank: bank,
                origProgram: program,
                bank: timidityProgram < 127 ? timidityBank : timidityBank + 1,
                program: timidityProgram < 127 ? timidityProgram + 1 : 0,
                name,
                soundfont
            }) : acc;
        }, [] as IInstrument[]);
})();

export const generateCfg = async() => {
    const instruments = await Instruments;

    // Group the instruments by bank number
    const banks = instruments.reduce((acc, instrument) => {
        const name = `${instrument.bank}`;
        if (!acc[name]) {
            acc[name] = [];
        }
        acc[name].push(instrument);
        return acc;
    }, {} as { [key: string ]: IInstrument[] });

    // Output the instrument values to the timidity config file
    await promisify(writeFile)(`${path}/soundfonts/timidity.cfg`,
        `dir ${path}/soundfonts` + '\n\n' +
        Object.entries(banks).map(([bank, instruments]) =>
            `bank ${bank}` + '\n' +
            `${instruments.map(instrument => {
                return '\t' + `${instrument.program} ` +
                    `%font '${path}/soundfonts/${instrument.soundfont}' ` +
                    `${instrument.origBank} ${instrument.origProgram} ` +
                    `#${instrument.name}`;
            }).join("\n")}`)
        .join("\n\n"));
};
