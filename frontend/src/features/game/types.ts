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

export interface GameState {
    paddleL: Paddle;
    paddleR: Paddle;
    ball: Ball;
    started: boolean;
    paused: boolean;
    showMessage: string | null;
    countdown: number | null;
}

export interface GameConfig {
    baseW: number;
    baseH: number;
    padding: number;
}
