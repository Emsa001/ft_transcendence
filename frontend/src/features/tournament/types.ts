import { GameDTOType, GameStatus, TournamentUserDTOType } from "shared";

export interface LocalTournamentState {
    tournamentId: number;
    status: GameStatus;
    players: TournamentUserDTOType[];
    games: GameDTOType[];
    round: number;
    winner: string | null;
    currentGame: GameDTOType | null;

    randomEvents: boolean;
    maxScore: number;
}

export interface LocalTournamentContextType extends LocalTournamentState {
    maxPlayers: number;

    maxScore: number;
    randomEvents: boolean;
    setMaxScore: (score: number) => void;
    setRandomEvents: (enabled: boolean) => void;

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
