import { GameDTOType, GameStatus } from "./game";
import { UserDTOType } from "./user";

export type TournamentUserDTOType = UserDTOType & {
    eliminated: boolean;
};

export interface TournamentDTOType {
    id: number;
    name: string;
    status: GameStatus;
    players: TournamentUserDTOType[];
    games?: GameDTOType[];
    round: number;
    maxPlayers: number;
    maxScore: number;
    winnerId: number | null;
    hostId: number | null;
    uuid: string;
}

export interface TournamentCreateType {
    name?: string;
    maxPlayers?: number;
    maxScore?: number;
    isPrivate?: boolean;
    hostId?: number | null;
}