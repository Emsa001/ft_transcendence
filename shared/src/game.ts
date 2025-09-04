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
    hostId: number | null;
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
}

export interface GameCreationAttributes extends GameCreationRequest {
    hostId?: number | null;
    round?: number | null;
    tournamentId?: number;
    winnerId?: number | null;
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

export class GameMessages {
    static win(scorer: string, canRestart?: boolean): GameMessage[] {
        const message: GameMessage[] = [
            {
                text: `${scorer} Wins!`,
                shadow: { color: "#7a5cff", blur: 20 },
                size: 60,
            },
        ];

        if (canRestart) {
            message.push({
                text: "Press Space to Restart",
                size: 30,
            });
        }

        return message;
    }

    static score(scorer: string): GameMessage[] {
        return [
            {
                text: `${scorer} Scores!`,
                shadow: { color: "#7a5cff", blur: 20 },
                size: 50,
            },
        ];
    }

    static start(): GameMessage[] {
        return [
            {
                text: "Press Space to Start",
                shadow: { color: "#7a5cff", blur: 20 },
                size: 40,
            },
        ];
    }

    static intro(
        player1: string,
        player2: string,
        points: number
    ): GameMessage[] {
        return [
            {
                text: `${player1}  VS  ${player2}`,
                shadow: { color: "#7a5cff", blur: 20 },
                size: 40,
            },
            { text: `First to ${points} points wins`, size: 30 },
        ];
    }

    static getReady(count: number): GameMessage[] {
        return [
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
    }

    static pause(): GameMessage[] {
        return [
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
    }
}
