import ITrack from "types/track";
import { Track } from "midi-writer-js";
import { clone } from "lodash";

export default [new Track()] as ITrack[];

export const addIndex = (midi: ITrack) => {
    const events = midi.events.filter(ev => ev.index !== undefined);
    const lastIndex = events.length ? events[events.length - 1].index : -1;
    midi.events = midi.events.map(event => {
        event.index = event.index !== undefined ? event.index : lastIndex + 1;
        return event;
    });
    return midi;
};
export const swapIndex = (midi: ITrack, indexToSwap: number, indexToSwapTo: number) => {
    const beforeEvents = midi.events.filter(ev => ev.index < indexToSwapTo && ev.index !== indexToSwap);
    const afterEvents = midi.events.filter(ev => ev.index >= indexToSwapTo && ev.index !== indexToSwap)
        .map(ev => {
            const evClone = clone(ev);
            if (evClone.index <= indexToSwap) {
                evClone.index++;
            }
            return evClone;
        });
    const lastEvents = midi.events.filter(ev => ev.index === indexToSwap)
        .map(ev => {
            const evClone = clone(ev);
            evClone.index = indexToSwapTo;
            return evClone;
        });
    console.log(lastEvents);
    midi.events = [...beforeEvents, ...lastEvents, ...afterEvents];
    return midi;
};

export const removeIndex = (midi: ITrack, index: number) => {
    midi.events = midi.events.filter(ev => {
        return ev.index !== index;
    }).map(ev => {
        ev.index = ev.index > index ? ev.index - 1 : ev.index;
        return ev;
    });
    return midi;
};
