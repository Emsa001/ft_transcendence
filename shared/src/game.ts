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
    status: GameStatus;
    mode: GameMode;
    isPrivate: boolean;
    round?: number | null;
    maxScore?: number | null;
    players: GameUserDTOType[];
    winner: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface GameHistoryFilter {
    start?: Date;
    end?: Date;
    limit?: number;
}

export type GameCreationAttributes = {
    status?: GameStatus;
    mode?: GameMode;
    isPrivate?: boolean;
    round?: number | null;
    maxScore?: number;
    maxPlayers?: number;
    tournamentId?: number;
    winnerId?: number | null;
};
