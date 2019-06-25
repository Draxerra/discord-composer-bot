export default interface INote {
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