import ITrack from "types/track";
import { Track } from "midi-writer-js";

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

export const removeIndex = (midi: ITrack, index: number) => {
    midi.events = midi.events.filter(ev => {
        return ev.index !== index;
    }).map(ev => {
        ev.index = ev.index > index ? ev.index - 1 : ev.index;
        return ev;
    });
    return midi;
};
