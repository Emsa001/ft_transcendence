import { GameDTOType, GameStatus, TournamentUserDTOType } from "shared";

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

export type GameWindowState =
    | "menu"
    | "local-casual"
    | "local-tournament"
    | "remote-casual"
    | "remote-tournament";

export type StatusMessage = {
    message: string;
    success: boolean;
};

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
