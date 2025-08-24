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
}

export interface GameDTOType {
    id: number;
    status: GameStatus;
    mode: GameMode;
    players: GameUserDTOType[];
    winner: number | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface GameHistoryFilter {
    start?: Date;
    end?: Date;
    limit?: number;
}