import { WebSocket } from "@fastify/websocket";
import { User } from "@/database/models/User/User";
import { Game } from "@/database/models/Game/Game";
import { WebSocketService } from "@/lib/WebSocketService";
import { GameMessages, GameStatus, MessageData } from "shared";
import { GameRooms } from "./registry.service";
import { GameEngine } from "./engine.service";
import { HttpException } from "@/utils/exceptions";
import { Tournament } from "@/database/models/Tournaments/Tournament";
import { TournamentRooms } from "@/modules/tournament/services/registry.service";

/**
 * Utility for handling countdown messages.
 */
class CountdownService {
    constructor(private send: (msg: MessageData | null) => void) {}

    run(count = 3, interval = 1000): Promise<void> {
        return new Promise<void>((resolve) => {
            const countdownInterval = setInterval(() => {
                if (count > 0) {
                    this.send(GameMessages.getReady(count));
                    count--;
                } else {
                    clearInterval(countdownInterval);
                    this.send(null);
                    resolve();
                }
            }, interval);
        });
    }
}

// TODO: Cleanup room from storage when finished

/**
 * Handles the lifecycle of a game room and its players.
 */
export class GameRoom extends WebSocketService {
    game: Game;
    engine: GameEngine;

    private gameLoopInterval: NodeJS.Timeout | null = null;
    private countdownService: CountdownService;

    constructor(game: Game) {
        super();
        this.game = game;
        this.engine = new GameEngine();
        this.engine.onScore = this.onScore.bind(this);
        this.engine.onRandomEvent = this.onRandomEvent.bind(this);
        this.countdownService = new CountdownService(
            this.gameMessage.bind(this)
        );
    }

    /* -------------------- Player Management -------------------- */

    async addPlayer(connection: WebSocket, user: User) {
        try {
            let gameUser = this.game.players.find((p) => p.id === user.id);

            if (!gameUser) {
                await this.game.addPlayer(user);
                await this.game.reload({ include: ["players"] });
                console.log(
                    `Player ${user.username} joined game ${this.game.code}`
                );
                gameUser = this.game.players.find((p) => p.id === user.id);
            }

            if (!gameUser)
                throw new HttpException(501, "Failed to add player to game");

            this.broadcast({
                type: "PLAYER_JOINED",
                player: gameUser.toDTO().gameUser(),
            });

            this.addClient(user.id, connection);
            await this.updateState(connection);

            if (this.game.players.length === this.game.maxPlayers) {
                GameRooms.triggerHooks("onGameAvailabilityChange", this.game);

                if (this.game.tournamentId) {
                    // check if all players are connected
                    const allConnected = this.game.players.every((p) => {
                        const conns = this.getClient(p.id);
                        return conns && conns.length > 0;
                    });
                    if (allConnected) await this.startGame();
                }
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

        const userConnections = this.getClient(userId);
        if (userConnections.length > 1) return;

        if (this.game.status !== GameStatus.WAITING) {
            this.broadcast({
                type: "PLAYER_DISCONNECTED",
                player: user.toDTO().gameUser(),
            });
            return;
        }

        if (this.game.tournamentId) return;

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
            player: user.toDTO().gameUser(),
            host: this.game.hostId,
        });
    }

    /* -------------------- Game Flow -------------------- */

    async startGame() {
        if (this.game.status != GameStatus.WAITING) return;

        await this.game.update({ status: GameStatus.IN_PROGRESS });
        const tournament = await Tournament.findByPk(this.game.tournamentId);
        if (tournament) {
            const room = TournamentRooms.get(tournament.uuid);
            if (room) {
                room.broadcast({
                    type: "GAME_UPDATE",
                    game: this.game.toDTO(),
                });
            }
        }

        const players = this.game.getGameUsers();

        this.engine.initPaddles(players);
        this.engine.randomEvents = this.game.randomEvents;
        this.updateState();
        this.startGameLoop();

        const player1 = players[0].username;
        const player2 = players[1].username;

        this.gameMessage(
            GameMessages.intro(player1, player2, this.game.maxScore)
        );

        await this.countdownService.run(3);
        this.engine.resetPositions();
        this.engine.togglePause();
    }

    private async endGame(delay: number) {
        await this.game.end();
        this.stopGameLoop();

        setTimeout(async () => {
            this.updateState();
            await GameRooms.remove(this.game.code!);
        }, delay * 1000);
    }

    /* -------------------- Score Handling -------------------- */

    async onScore(scorerId: number) {
        try {
            this.engine.resetPositions();
            this.engine.togglePause();
            await this.game.playerScore(scorerId, 1);
            await this.game.reload({ include: ["players"] });

            const player = this.game.players.find((p) => p.id === scorerId);
            if (!player) return;

            this.updateState();

            if (player.GameUser.score >= this.game.maxScore) {
                this.gameMessage(GameMessages.win(player.username));
                await this.endGame(2);
            } else {
                this.gameMessage(GameMessages.score(player.username));
                await this.countdownService.run(3);
                this.engine.togglePause();
            }
        } catch {
            this.engine.togglePause();
            throw new HttpException(500, "Failed to update player score");
        }
    }

    /* -------------------- Random Events -------------------- */

    onRandomEvent(event: string) {
        if (this.engine.stopped) return;
        this.gameMessage(GameMessages.event(event));
        // this.broadcast({ type: "GAME_EVENT", event });
    }

    /* -------------------- Game Loop -------------------- */

    startGameLoop() {
        if (this.gameLoopInterval) clearInterval(this.gameLoopInterval);

        this.gameLoopInterval = setInterval(() => {
            if (this.engine.update()) {
                this.broadcast({
                    type: "GAME_FRAME",
                    frame: this.engine.getFrame(),
                });
            }
        }, 1000 / GameEngine.fps);
    }

    stopGameLoop() {
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
        }
    }

    /* -------------------- Messaging -------------------- */

    private gameMessage(message: MessageData | null) {
        this.broadcast({ type: "GAME_MESSAGE", message });
    }

    async updateState(client?: WebSocket) {
        const payload = { type: "GAME_UPDATE", state: this.game.toDTO() };
        if (client) this.sendToClient(client, payload);
        else this.broadcast(payload);
    }

    /* -------------------- WebSocket Events -------------------- */

    protected onMessage(connection: WebSocket, message: any) {
        const payload = JSON.parse(message);
        const userId = this.getUserId(connection);
        if (!userId) return;

        switch (payload.type) {
            case "START_GAME":
                if (userId === this.game.hostId) this.startGame();
                break;

            case "PLAYER_INPUT":
                this.engine.handleInput(userId, payload.key, payload.state);
                break;

            default:
                console.warn("Unknown message type:", payload.type);
        }
    }

    protected async onClientDisconnect(connection: WebSocket) {
        const userId = this.getUserId(connection);
        if (!userId) return;

        await this.removePlayer(userId);
    }
}
