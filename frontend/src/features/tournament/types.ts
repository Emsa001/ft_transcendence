import { GameDTOType, GameStatus, TournamentUserDTOType } from "shared";

export interface LocalTournamentState {
    tournamentId: number;
    status: GameStatus;
    players: TournamentUserDTOType[];
    games: GameDTOType[];
    round: number;
    winnerId: number | null;
    currentGame: GameDTOType | null;
}

export interface LocalTournamentActions {
    setStatus: (status: GameStatus) => void;
    setPlayers: (
        players:
            | TournamentUserDTOType[]
            | ((prev: TournamentUserDTOType[]) => TournamentUserDTOType[])
    ) => void;
    setGames: (games: GameDTOType[]) => void;
    setRound: (round: number | ((prev: number) => number)) => void;
    setCurrentGame: (game: GameDTOType | null) => void;
    addPlayer: (username: string) => StatusMessage;
    removePlayer: (username: string) => void;
    startTournament: () => void;
    endTournament: () => void;
    createRound: () => GameDTOType[];
    nextRound: () => GameDTOType[]; // Alias for createRound
    setWinner: (gameId: number, winnerUsername: string) => void;
    playGame: () => void;
    deleteTournament: () => void;
}

export type LocalTournamentContextType = LocalTournamentState &
    LocalTournamentActions & {
        maxPlayers: number;
        getActivePlayers: () => TournamentUserDTOType[];
    };
