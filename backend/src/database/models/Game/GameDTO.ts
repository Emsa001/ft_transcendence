import { UserDTO } from "../User/UserDTO";
import { Game, GameMode, GameStatus } from "./Game";

export class GameDTO {
    id: number;
    status: GameStatus;
    mode: GameMode;
    players: UserDTO[];

    constructor(game: Game) {
        if (!game || !game.id)
            throw new Error("Game data is required to create GameDTO");
        if (!game.status || !game.mode)
            throw new Error(
                "Game status and mode are required to create GameDTO"
            );

        this.id = game.id;
        this.status = game.status;
        this.mode = game.mode;
        this.players = game.players?.map((e) => e.toDTO()) || [];
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
