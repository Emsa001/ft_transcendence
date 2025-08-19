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
    winnerId: number | null;
}
