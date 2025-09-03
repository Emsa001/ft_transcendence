export type Vec2 = { x: number; y: number };

export interface Paddle {
    x: number;
    y: number;
    w: number;
    h: number;
    speed: number;
    controls: {
        up: string;
        down: string;
    };
}

export interface Ball {
    pos: Vec2;
    vel: Vec2;
    size: number;
    speed: number;
}

export interface PongPlayer {
    username: string;
    id: string;
    score: number;
    paddle: Paddle;
}

export interface GameData {
    players: PongPlayer[];
    state: "created" | "started" | "paused" | "finished";
    countdown: number | null;
}

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
        blur: number;
    };
    marginTop?: number;
    text: string;
}
