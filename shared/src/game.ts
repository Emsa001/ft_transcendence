import { RandomEvent } from "./game.engine";
import { TournamentDTOType } from "./tournament";
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
    code: string;
    hostId: number | null;
    status: GameStatus;
    mode: GameMode;
    isPrivate: boolean;
    randomEvents: boolean;
    round?: number | null;
    maxScore?: number | null;
    players: GameUserDTOType[];
    maxPlayers: number;
    winner: string | null;
    tournamentId: number | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface GameHistoryFilter {
    start?: Date;
    end?: Date;
    limit?: number;
}

export interface GameHistory {
    games: GameDTOType[];
    tournaments: TournamentDTOType[];
}

export interface GameCreationRequest {
    status?: GameStatus;
    mode?: GameMode;
    isPrivate?: boolean;
    maxScore?: number;
    maxPlayers?: number;
}

export interface GameCreationAttributes extends GameCreationRequest {
    hostId?: number | null;
    round?: number | null;
    tournamentId?: number;
    winnerId?: number | null;
    randomEvents?: boolean;
}

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
    selectedEvent: RandomEvent | null;
}

export interface GameMessage {
    size?: number;
    color?: string;
    shadow?: {
        color: string;
        blur?: number;
    };
    marginTop?: number;
    text: string;
}

// Game messages

export interface MessageData {
    messages: GameMessage[];
    cover: boolean;
    duration?: number;
}


export class GameMessages {
    static win(scorer: string, canRestart?: boolean): MessageData {
        const messages: GameMessage[] = [
            {
                text: `${scorer} Wins!`,
                shadow: { color: "#7a5cff", blur: 20 },
                size: 60,
            },
        ];

        if (canRestart) {
            messages.push({
                text: "Press Space to Restart",
                size: 30,
            });
        }

        return { messages, cover: true };
    }

    static score(scorer: string): MessageData {
        const messages: GameMessage[] = [
            {
                text: `${scorer} Scores!`,
                shadow: { color: "#7a5cff", blur: 20 },
                size: 50,
            },
        ];
        return { messages, cover: true };
    }

    static start(): MessageData {
        const messages: GameMessage[] = [
            {
                text: "Press Space to Start",
                shadow: { color: "#7a5cff", blur: 20 },
                size: 40,
            },
        ];
        return { messages, cover: true };
    }

    static intro(
        player1: string,
        player2: string,
        points: number
    ): MessageData {
        const messages: GameMessage[] = [
            {
                text: `${player1}  VS  ${player2}`,
                shadow: { color: "#7a5cff", blur: 20 },
                size: 40,
            },
            { text: `First to ${points} points wins`, size: 30 },
        ];

        return { messages, cover: true };
    }

    static getReady(count: number): MessageData {
        const messages: GameMessage[] = [
            {
                text: "Get Ready!",
                shadow: { color: "#7a5cff", blur: 20 },
                size: 40,
            },
            {
                text: `Starting in ${count}`,
                size: 30,
                marginTop: 10,
            },
        ];
        return { messages, cover: true };
    }

    static pause(): MessageData {
        const messages: GameMessage[] = [
            {
                text: "Paused",
                shadow: { color: "#f72585", blur: 20 },
                size: 50,
            },
            {
                text: "Press Space to Resume",
                size: 30,
            },
        ];

        return { messages, cover: true };
    }

    static event(event: string): MessageData {
        const messages: GameMessage[] = [
            {
                text: "Random Event!",
                shadow: { color: "#f72585", blur: 20 },
                size: 40,
            },
            {
                text: event,
                size: 30,
            }
        ];
        return { messages, cover: false };
    }
}

