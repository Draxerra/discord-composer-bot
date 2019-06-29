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
    pitch: string;
    duration: string;
    wait?: string;
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
    wait?: string;
    velocity: number;
    startTick?: number;
    duration?: string;
    midiNumber: number;
    tick?: number;
    delta?: number;
    data?: any;
    index?: number;
}
