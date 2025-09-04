import { UserDTOType } from "./user";

export enum GameStatus {
    LOCKED = "locked",
    WAITING = "waiting",
    IN_PROGRESS = "in_progress",
    FINISHED = "finished",
}

export enum GameMode {
    NORMAL = "normal",
    CODE = "code",
}

export type GameUserDTOType = UserDTOType & {
    score: number;
};

export interface GameDTOType {
    id: number;
    code: string | null;
    hostId: number;
    status: GameStatus;
    mode: GameMode;
    isPrivate: boolean;
    round?: number | null;
    maxScore?: number | null;
    players: GameUserDTOType[];
    maxPlayers: number;
    winner: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface GameHistoryFilter {
    start?: Date;
    end?: Date;
    limit?: number;
}

export interface GameCreationRequest {
    status?: GameStatus;
    mode?: GameMode;
    isPrivate?: boolean;
    maxScore?: number;
    maxPlayers?: number;
};

export interface GameCreationAttributes extends GameCreationRequest{
    hostId: number;
    round?: number | null;
    tournamentId?: number;
    winnerId?: number | null;
};



export type Vec2 = { x: number; y: number };

export interface Paddle {
    pos: Vec2;
    size: Vec2;
    speed: number;
    vel: number;
    controls: { up: string; down: string };
}

export interface Ball {
    pos: Vec2;
    vel: Vec2;
    size: number;
    speed: number;
}

export interface GameFrame {
    ball?: Ball;
    paddles?: Record<number, Paddle>;
}
