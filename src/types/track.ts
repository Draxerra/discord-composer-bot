export default interface ITrack {
    type: number[];
    data: any[];
    size: any[];
    events: INoteEvent[];
    explicitTickEvents: any[];
    tickPointer: number;
    addEvent(note: INote): void;
}
export interface INote {
    pitch: string | string[];
    duration: string | string[];
    wait?: string | string[];
    sequential?: boolean;
    velocity?: number;
    repeat?: number;
    channel?: number;
    grace?: string | string[];
    startTick?: number;
}
export interface INoteEvent {
    type: string;
    channel: number;
    pitch: string;
    wait: number;
    velocity: number;
    startTick?: number;
    midiNumber: number;
    tick?: number;
    delta?: number;
    data?: any;
    index?: number;
}
