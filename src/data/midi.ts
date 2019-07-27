import { INoteEvent, Constants, Utils } from "midi-writer-js";
import { scale } from "@tonaljs/scale";

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

export class TempoEvent {
    public data: number[] = [];
    public type = "tempo";

    public constructor(bpm: number) {
        const tempo = Math.round(60000000 / bpm);
        this.data = Utils.numberToVariableLength(0x00).concat(Constants.META_EVENT_ID, Constants.META_TEMPO_ID, [0x03],
            Utils.numberToBytes(tempo, 3));
    }
}

export class TrackNameEvent {
    public data: number[] = [];
    public type = 'track-name';

    public constructor(trackName: string) {
        const textBytes = Utils.stringToBytes(trackName);
        this.data = Utils.numberToVariableLength(0x00).concat(Constants.META_EVENT_ID, Constants.META_TRACK_NAME_ID, Utils.numberToVariableLength(textBytes.length), textBytes);
    }
}

export class KeySignatureEvent {
    public type = 'key-signature';
    public data: number[] = [];

    public constructor(scaleStr: string) {
        const noteKeySignature = scale(scaleStr);
        const type = noteKeySignature.type === "major" ? 0 : 1;
        const flats = noteKeySignature.notes.filter(note => note.includes("b")).length * -1;
        const sharps = noteKeySignature.notes.filter(note => note.includes("#")).length;

        this.data = Utils.numberToVariableLength(0x00).concat(Constants.META_EVENT_ID, Constants.META_KEY_SIGNATURE_ID, [0x02], // Size
            Utils.numberToBytes(sharps > 0 ? sharps : flats, 1), // Number of sharp or flats ( < 0 flat; > 0 sharp)
            Utils.numberToBytes(type, 1)); // Mode: 0 major, 1 minor
    }
}

export class LyricEvent {
    public type = 'marker';
    public data: number[] = [];

    public constructor(lyric: string) {
        const textBytes = Utils.stringToBytes(lyric);
        this.data = Utils.numberToVariableLength(0x00).concat(Constants.META_EVENT_ID, Constants.META_LYRIC_ID, Utils.numberToVariableLength(textBytes.length), textBytes);
    }
}

export class MarkerEvent {
    public type = 'marker';
    public data: number[] = [];

    public constructor(marker: string) {
        const textBytes = Utils.stringToBytes(marker);
        this.data = Utils.numberToVariableLength(0x00).concat(Constants.META_EVENT_ID, Constants.META_MARKER_ID, Utils.numberToVariableLength(textBytes.length), textBytes);
    }
}

export class TextEvent {
    public type = 'text';
    public data: number[] = [];

    public constructor(text: string) {
        const textBytes = Utils.stringToBytes(text);
        this.data = Utils.numberToVariableLength(0x00).concat(Constants.META_EVENT_ID, Constants.META_TEXT_ID, Utils.numberToVariableLength(textBytes.length), textBytes);
    }
}

export class InstrumentNameEvent {
    public type = 'instrument-name';
    public data: number[] = [];

    public constructor(instrumentName: string) {
        const textBytes = Utils.stringToBytes(instrumentName);
        this.data = Utils.numberToVariableLength(0x00).concat(Constants.META_EVENT_ID, Constants.META_INSTRUMENT_NAME_ID, Utils.numberToVariableLength(textBytes.length), textBytes);
    }
}

export class EndTrackEvent {
    public type = 'end-track';
    public data: number[] = [];

    public constructor() {
        this.data = Utils.numberToVariableLength(0x00).concat(Constants.META_EVENT_ID, Constants.META_END_OF_TRACK_ID);
    }
}

export class CuePointEvent {
    public type = 'marker';
    public data: number[] = [];

    public constructor(cuePoint: string) {
        const textBytes = Utils.stringToBytes(cuePoint);
        this.data = Utils.numberToVariableLength(0x00).concat(Constants.META_EVENT_ID, Constants.META_INSTRUMENT_NAME_ID, Utils.numberToVariableLength(textBytes.length), textBytes);
    }
}

export class CopyrightEvent {
    public type = 'copyright';
    public data: number[] = [];

    public constructor(copyright: string) {
        const textBytes = Utils.stringToBytes(copyright);
        this.data = Utils.numberToVariableLength(0x00).concat(Constants.META_EVENT_ID, Constants.META_COPYRIGHT_ID, Utils.numberToVariableLength(textBytes.length), textBytes);
    }
}

export class TimeSignatureEvent {
    public type = 'time-signature';
    public data: number[] = [];

    public constructor(num: number, den: number, midiClocksPerTick = 24, notesPerMidiClock = 8) {
        this.data = Utils.numberToVariableLength(0x00).concat(Constants.META_EVENT_ID, Constants.META_TIME_SIGNATURE_ID, [0x04],
            Utils.numberToBytes(num, 1),
            Utils.numberToBytes(Math.log2(den), 1),
            Utils.numberToBytes(midiClocksPerTick, 1),
            Utils.numberToBytes(notesPerMidiClock, 1)
        );
    }
}

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
    keySignature?: string;
    timeSignature?: number[];
    tempo?: number;
}

export const Notes = Object.keys(NotesMap);
export type TDuration = keyof typeof NotesMap;

export default [[]] as IExtendedNoteEvent[][];
