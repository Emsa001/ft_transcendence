import { GameDTOType, GameMode, GameStatus, GameUserDTOType } from "shared";
import { Game } from "./Game";
import { HttpException } from "@/utils/exceptions";

export class GameDTO implements GameDTOType {
    id: number;
    hostId: number | null;
    code: string;
    status: GameStatus;
    mode: GameMode;
    isPrivate: boolean;
    round?: number | null;
    maxScore: number | null;
    players: GameUserDTOType[];
    maxPlayers: number;
    winner: string | null;
    createdAt: Date;
    updatedAt: Date;
    tournamentId: number | null;

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
        this.hostId = game.hostId;
        this.code = game.code || "-1";
        this.status = game.status;
        this.mode = game.mode;
        this.isPrivate = game.isPrivate;
        this.round = game.round;
        this.maxScore = game.maxScore;
        this.maxPlayers = game.maxPlayers;
        this.players = game.players
            ? game.players.map((player) => ({
                  ...player.toDTO(),
                  score: player.GameUser.score,
              }))
            : [];
        this.winner = game.winnerId
            ? game.players.find((p) => p.id === game.winnerId)?.username || null
            : null;
        this.tournamentId = game.tournamentId ?? null;
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
