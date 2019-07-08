import { INoteEvent } from "midi-writer-js";

export enum NotesMap {
    none = "0",
    whole = "1",
    half = "2",
    "dotted-half" = "d2",
    quarter = "4",
    "quarter-triplet" = "4t",
    "dotted-quarter" = "d4",
    eighth = "8",
    "eighth-triplet" = "8t",
    "dotted-eighth" = "d8",
    sixteenth = "16",
    "sixteenth-triplet" = "16t",
    "thirty-second" = "32",
    "sixty-fourth" = "64"
}
export const Notes = Object.keys(NotesMap);
export type TDuration = keyof typeof NotesMap;

export default [[]] as INoteEvent[][];
