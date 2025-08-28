export type Vec2 = { x: number; y: number };

export interface Paddle {
    x: number;
    y: number;
    w: number;
    h: number;
    speed: number;
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
    controls: {
        up: string;
        down: string;
    };
}

export interface GameData {
    players: PongPlayer[];
    ball: Ball;
    state: "created" | "started" | "paused" | "finished";
    showMessage: string | null;
    countdown: number | null;
}

export interface GameConfig {
    baseW: number;
    baseH: number;
    padding: number;
    maxPlayers?: number;
}

export type WindowState = "menu" | "casual" | "tournament";
