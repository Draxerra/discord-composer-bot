import { INoteEvent, Constants, Utils } from "midi-writer-js";

interface IControllerChangeEventFields {
    controllerNumber: number,
    controllerValue: number
}

export class ControllerChangeEvent implements IControllerChangeEventFields {
    public controllerNumber: number = 0;
    public controllerValue: number = 0;
    public type = "controller";
    public data: number[] = [];

    public constructor(fields: IControllerChangeEventFields) {
        this.controllerNumber = fields.controllerNumber;
        this.controllerValue = fields.controllerValue;
        this.data = Utils.numberToVariableLength(0x00).concat(Constants.CONTROLLER_CHANGE_STATUS, this.controllerNumber, this.controllerValue);
    }
};

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


export interface IExtendedNoteEvent extends INoteEvent {
    instrument: string;
}

export const Notes = Object.keys(NotesMap);
export type TDuration = keyof typeof NotesMap;

export default [[]] as IExtendedNoteEvent[][];
