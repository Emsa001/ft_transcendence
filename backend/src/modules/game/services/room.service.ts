import { WebSocket } from "@fastify/websocket";
import { User } from "@/database/models/User/User";
import { Game } from "@/database/models/Game/Game";
import { WebSocketService } from "@/lib/WebSocketService";
import { GameFrame, GameStatus } from "shared";
import { GameRooms } from "./registry.service";
import { GameEngine } from "./engine.service";

export class GameRoom extends WebSocketService {
    game: Game;
    engine: GameEngine;
    private gameLoopInterval: NodeJS.Timeout | null = null;

    constructor(game: Game) {
        super();
        this.game = game;
        this.engine = new GameEngine();
    }

    private endGame() {
        this.game.status = GameStatus.FINISHED;
        this.game.save();
        this.broadcast({ type: "GAME_ENDED" });
        this.stopGameLoop();
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

        if (this.game.status !== GameStatus.WAITING) {
            this.broadcast({
                type: "PLAYER_DISCONNECTED",
                player: user.toDTO(),
            });
            return;
        }

        await this.game.removePlayer(user);
        await this.game.reload({ include: ["players"] });

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

        this.engine.initPaddles(this.game.getGameUsers());
        this.updateState();
        this.startGameLoop();
        setTimeout(() => {
            this.engine.togglePause();
        }, 3000);
    }

    private startGameLoop() {
        if (this.gameLoopInterval) clearInterval(this.gameLoopInterval);

        this.gameLoopInterval = setInterval(() => {
            this.engine.update(); // fixed physics step
            this.broadcastFrame();
        }, 1000 / GameEngine.fps);
    }

    private stopGameLoop() {
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
        }
    }

    private broadcastFrame() {
        const frame: GameFrame = {
            ball: this.engine.ball,
            paddles: this.engine.paddles,
        };
        this.broadcast({ type: "GAME_FRAME", frame });
    }

    async updateState(client?: WebSocket) {
        const payload = { type: "GAME_UPDATE", state: this.game.toDTO() };
        if (client) this.sendToClient(client, payload);
        else this.broadcast(payload);
    }

    protected onMessage(connection: WebSocket, message: any) {
        const payload = JSON.parse(message);
        const userId = this.getUserId(connection);
        if (!userId) return;

        switch (payload.type) {
            case "START_GAME":
                if (userId === this.game.hostId) this.startGame();
                break;

            case "PLAYER_INPUT":
                // only update paddle velocity, not physics
                this.engine.handleInput(userId, payload.key, payload.state);
                break;

            default:
                console.warn("Unknown message type:", payload.type);
        }
    }

    protected async onClientDisconnect(connection: WebSocket) {
        const userId = this.getUserId(connection);
        if (!userId) return;

        // TODO: allow reconnect window

        await this.removePlayer(userId);
    }
}
