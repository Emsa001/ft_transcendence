import { GameDTOType, GameStatus, TournamentUserDTOType } from "shared";

export interface LocalTournamentState {
    tournamentId: number;
    status: GameStatus;
    players: TournamentUserDTOType[];
    games: GameDTOType[];
    round: number;
    winner: string | null;
    currentGame: GameDTOType | null;
}

export interface LocalTournamentContextType extends LocalTournamentState {
    maxPlayers: number;

    getActivePlayers: () => TournamentUserDTOType[];
    setCurrentGame: (game: GameDTOType | null) => void;

    addPlayer: (username: string) => StatusMessage;
    removePlayer: (username: string) => void;
    startTournament: () => void;
    endTournament: () => void;
    startRound: () => GameDTOType[];
    setWinner: (gameId: number, winnerUsername: string) => void;
    playGame: (code: string) => void;
    deleteTournament: () => void;
}
