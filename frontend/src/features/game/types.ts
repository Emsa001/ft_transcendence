export type Vec2 = { x: number; y: number };

export interface Paddle {
    x: number;
    y: number;
    w: number;
    h: number;
    speed: number;
    controls: { up: string; down: string };
    playerId: number;
}

export interface Ball {
    pos: Vec2;
    vel: Vec2;
    size: number;
    speed: number;
}

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
