import { GameDTOType, GameMode, GameStatus, GameUserDTOType } from "shared";
import { Game } from "./Game";
import { HttpException } from "@/utils/exceptions";

export class GameDTO implements GameDTOType {
    id: number;
    status: GameStatus;
    mode: GameMode;
    players: GameUserDTOType[];
    winner: string | null;
    updatedAt: Date;
    createdAt: Date;

    constructor(game: Game) {
        if (!game || !game.id)
            throw new HttpException(
                404,
                "Game data is required to create GameDTO"
            );
        if (!game.status || !game.mode)
            throw new HttpException(
                400,
                "Game status and mode are required to create GameDTO"
            );

        this.id = game.id;
        this.status = game.status;
        this.mode = game.mode;
        this.players = game.players.map((player) => ({
            ...player.toDTO(),
            score: player.GameUser.score,
        }));
        this.winner = game.winnerId
            ? game.players.find((p) => p.id === game.winnerId)?.username || null
            : null;
        this.createdAt = game.createdAt;
        this.updatedAt = game.updatedAt;
    }

    toString(): string {
        return `
            ID: ${this.id}
            Status: ${this.status}
            Mode: ${this.mode}
            Players: ${this.players.length}
        `;
    }
}
