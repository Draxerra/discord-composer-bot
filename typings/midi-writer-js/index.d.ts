declare module "midi-writer-js" {
    import { Stream } from "stream";

    type Notes = "0" | "1" | "2" | "d2" | "4" | "4t" | "d4" | "8" | "8t" | "d8" | "16" | "16t" | "32" | "64";

    interface INoteEvent {
        pitch: string[];
        duration: Notes[];
        wait: Notes[];
        sequential?: boolean;
        velocity: number;
        repeat?: number;
        channel?: number;
        grace?: Notes[];
        startTick?: number;
    }
    class NoteEvent {
        public constructor(note: INoteEvent);
    }

    class ProgramChangeEvent {
        public constructor(fields: { instrument: number });
    }

    class ControllerChangeEvent {
        public constructor(name: any);
    }
 
    class Track {
        addEvent(events: NoteEvent[] | ProgramChangeEvent, mapFunction?: (event: NoteEvent, index: number) => NoteEvent): void;
        setTempo(tempo: number): void;
        addText(text: string): void;
        addCopyright(text: string): void;
        addTrackName(text: string): void;
        addInstrumentName(name: string): void;
        addMarker(text: string): void;
        addCuePoint(text: string): void;
        addLyric(text: string): void;
        setTimeSignature(numerator: number, denominator: number): void;
    }
    class Writer {
        public constructor(tracks: Track[]);
        buildFile(): Uint8Array;
        base64(): string;
        dataUri(): string;
        stdout(): Stream;
    }

    const Constants: {
        VERSION: string;
        HEADER_CHUNK_TYPE: number[];
        HEADER_CHUNK_LENGTH: number[];
        HEADER_CHUNK_FORMAT0: number[];
        HEADER_CHUNK_FORMAT1: number[];
        HEADER_CHUNK_DIVISION: number[];
        TRACK_CHUNK_TYPE: number[];
        META_EVENT_ID: number;
        META_TEXT_ID: number;
        META_COPYRIGHT_ID: number;
        META_TRACK_NAME_ID: number;
        META_INSTRUMENT_NAME_ID: number;
        META_LYRIC_ID: number;
        META_MARKER_ID: number;
        META_CUE_POINT: number;
        META_TEMPO_ID: number;
        META_SMTPE_OFFSET: number;
        META_TIME_SIGNATURE_ID: number;
        META_KEY_SIGNATURE_ID: number;
        META_END_OF_TRACK_ID: number[];
        CONTROLLER_CHANGE_STATUS: number;
        PROGRAM_CHANGE_STATUS: number;
    }
    class Utils {
        public static version(): number;
        public static stringToBytes(str: string): number[];
        public static isNumeric(str: any): boolean;
        public static getPitch(pitch: string | number): number;
        public static numberToVariableLength(num: number): number[];
        public static stringByteCount(str: string): number;
        public static numberFromBytes(bytes: number[]): number;
        public static numberToBytes(num: number, bytesNeeded: number): number[];
        public static toArray(str: string): string[];
        public static convertVelocity(num: number): number;
        public static getTickDuration(duration: string | string[]): number;
        public static getDurationMultiplier(duration: string): number;
    }
}