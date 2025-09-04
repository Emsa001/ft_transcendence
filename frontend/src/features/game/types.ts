export type GameState = "created" | "started" | "paused" | "finished";

export type GameWindowState =
    | "menu"
    | "local-casual"
    | "local-tournament"
    | "remote-casual"
    | "remote-tournament";

export interface StatusMessage {
    message: string;
    success: boolean;
}

export interface CanvasMessage {
    size?: number;
    color?: string;
    shadow?: {
        color: string;
        blur?: number;
    };
    marginTop?: number;
    text: string;
}
