declare module "midi-writer-js" {
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
        addEvent(events: NoteEvent[] | ProgramChangeEvent): void;
        addInstrumentName(name: string): void;
    }
    class Writer {
        public constructor(tracks: Track[]);
        buildFile(): string;
    }
}