import ICommand from "types/command";

export const notes = {
    name: "notes",
    description: "Shows all the notes and their tick equivalent",
    run: (msg) => {
        msg.channel.send({embed: {
            color: 3447003,
            title: "Notes",
            description: "A list of all the notes and their tick equivalent.",
            fields: [{
                name: "Whole",
                value: "512",
            }, {
                name: "Dotted Half",
                value: "384"
            }, {
                name: "Half",
                value: "256"
            }, {
                name: "Dotted Quarter",
                value: "192"
            }, {
                name: "Quarter",
                value: "128"
            }, {
                name: "Dotted Eighth",
                value: "96"
            }, {
                name: "Quarter Triplet",
                value: "85"
            }, {
                name: "Eighth",
                value: "64"
            }, {
                name: "Eighth Triplet",
                value: "42"
            }, {
                name: "Sixteenth",
                value: "32"
            }, {
                name: "Sixteenth Triplet",
                value: "21"
            }, {
                name: "Thirty-Second",
                value: "16"
            }, {
                name: "Sixty-fourth",
                value: "8"
            }]
        }});
    },
} as ICommand;
