import { WebSocket } from "@fastify/websocket";
import { User } from "@/database/models/User/User";
import { Game } from "@/database/models/Game/Game";
import { WebSocketService } from "@/lib/WebSocketService";
import { GameStatus } from "shared";
import { GameRooms } from "./registry.service";

export class GameRoom extends WebSocketService {
    game: Game;

    constructor(game: Game) {
        super();
        this.game = game;
    }

    private endGame() {
        this.game.status = GameStatus.FINISHED;
        this.game.save();
        this.broadcast({ type: "GAME_ENDED" });
    }

    async addPlayer(connection: WebSocket, user: User) {
        try {
            const isInGame = this.game.players.some((p) => p.id === user.id);

            if (!isInGame) {
                await this.game.addPlayer(user);
                await this.game.reload({ include: ["players"] });

                console.log(
                    `Player ${user.username} joined game ${this.game.code}`
                );
                this.broadcast({ type: "PLAYER_JOINED", player: user.toDTO() });
            }
            this.addClient(user.id, connection);
            this.updateState(connection);

            if (this.game.players.length === this.game.maxPlayers) {
                GameRooms.triggerHooks("onGameAvailabilityChange", this.game);
            }
        } catch (error) {
            console.error(
                `Error adding player to game ${this.game.code}:`,
                error
            );
            this.sendToClient(connection, {
                type: "error",
                message: (error as Error).message,
            });
            connection.close();
        }
    }

    async removePlayer(userId: number) {
        const user = this.game.players.find((p) => p.id === userId);
        if (!user) return;

        await this.game.removePlayer(user);
        await this.game.reload({ include: ["players"] });

        if (this.game.players.length === 1) {
            // set winner
        }

        if (this.game.players.length === 0) {
            await GameRooms.remove(this.game.code!);
            return;
        }

        if (this.game.players.length === this.game.maxPlayers - 1) {
            GameRooms.triggerHooks("onGameAvailabilityChange", this.game);
        }

        this.broadcast({
            type: "PLAYER_DISCONNECTED",
            player: user.toDTO(),
            host: this.game.hostId,
        });
    }

    async startGame() {
        this.game.status = GameStatus.IN_PROGRESS;
        await this.game.save();
        this.updateState();
    }

    async updateState(client?: WebSocket) {
        const payload = { type: "GAME_UPDATE", state: this.game.toDTO() };

        if (client) this.sendToClient(client, payload);
        else this.broadcast(payload);
    }

    protected onMessage(connection: WebSocket, message: any) {
        const payload = JSON.parse(message);
        const userId = this.getUserId(connection);

        switch (payload.type) {
            case "START_GAME":
                if (userId === this.game.hostId) this.startGame();
                break;
            default:
                console.warn("Unknown message type:", payload.type);
        }
    }

    protected async onClientDisconnect(connection: WebSocket) {
        const userId = this.getUserId(connection);
        if (!userId) return;

        // TODO: give player some time to reconnect

        await this.removePlayer(userId);
    }
}
