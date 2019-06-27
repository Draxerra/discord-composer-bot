import ICommand from "types/command";
import Midi from "data/midi";

export const remove = {
    name: "remove",
    description: "",
    run: (msg, client, args) => {
        const indexToRemove = parseInt(args[0]) - 1;
        const notesToRemove = Midi[0].events.filter(ev => ev.index === indexToRemove && ev.type === "note-on")
            .map(ev => ev.pitch).join("+");
        Midi[0].events = Midi[0].events.filter(ev => {
            return ev.index !== indexToRemove;
        }).map(ev => {
            ev.index = ev.index > indexToRemove ? ev.index - 1 : ev.index;
            return ev;
        });
        msg.reply(`successfully removed ${indexToRemove + 1}. ${notesToRemove}!`);
    },
} as ICommand;
