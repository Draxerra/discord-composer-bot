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
}