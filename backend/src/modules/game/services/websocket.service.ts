import { WebSocket } from "@fastify/websocket";
import { GameStore } from "./storage.service";
import { Game } from "@/database/models/Game/Game";
import { HttpException } from "@/utils/exceptions";
import { User } from "@/database/models/User/User";

export interface WSClient {
    socket: WebSocket;
    code: string;
}

export interface GameMessage {
    type: "ERROR" | "PLAYER_JOINED" | "GAME_STARTED" | "PLAYER_DISCONNECTED";
    message?: string;
    player?: string;
    game?: any;
}

// WebSocket configuration constants
export const WS_CONFIG = {
    HEARTBEAT_INTERVAL: 30000, // 30 seconds
    CONNECTION_STATES: {
        CONNECTING: 0,
        OPEN: 1,
        CLOSING: 2,
        CLOSED: 3,
    },
} as const;

class GameWebSocketService {
    private clients: Map<number, WSClient> = new Map();

    private broadcast(code: string, message: GameMessage): void {
        const gameClients = this.getGameClients(code);
        console.log(
            `Notifying ${gameClients.length} players in game ${code} with message type: ${message.type}`
        );

        gameClients.forEach((client) => {
            if (client.socket.readyState === WS_CONFIG.CONNECTION_STATES.OPEN) {
                client.socket.send(JSON.stringify(message));
            }
        });
    }

    getGameClients(code: string): WSClient[] {
        return Array.from(this.clients.values()).filter((c) => c.code === code);
    }

    validateGameExists(connection: WebSocket, code: string): boolean {
        const tempGame = GameStore.getTempGame(code);
        if (!tempGame) {
            const errorMessage: GameMessage = {
                type: "ERROR",
                message: "Game not found",
            };
            connection.send(JSON.stringify(errorMessage));
            return false;
        }
        return true;
    }

    addPlayerToGame(connection: WebSocket, code: string, user: User): void {
        if (this.clients.has(user.id)) {
            throw new HttpException(
                409,
                `User ${user.username} is already in the game ${code}`
            );
        }

        GameStore.addPlayer(code, user.id);
        this.clients.set(user.id, { socket: connection, code });
        console.log(
            `Added user ${user.id} to game ${code}. Total clients: ${this.clients.size}`
        );

        this.broadcast(code, {
            type: "PLAYER_JOINED",
            player: user.username,
        });
    }

    setupHeartbeat(
        connection: WebSocket,
        user: User,
        code: string
    ): NodeJS.Timeout {
        const heartbeatInterval = setInterval(() => {
            if (connection.readyState === WS_CONFIG.CONNECTION_STATES.OPEN) {
                connection.ping();
            } else {
                console.log(
                    `Connection for user ${user.username} is no longer open (state: ${connection.readyState}), clearing interval`
                );
                clearInterval(heartbeatInterval);
            }
        }, WS_CONFIG.HEARTBEAT_INTERVAL);

        connection.on("pong", () => {
            console.log(
                `Received pong from user ${user.username} in game ${code}`
            );
        });

        return heartbeatInterval;
    }

    handlePlayerDisconnection(
        user: User,
        code: string,
        heartbeatInterval: NodeJS.Timeout,
        reason?: string
    ): void {
        console.log(
            `User ${user.username} disconnected from game ${code}${reason ? ` (${reason})` : ""}`
        );
        clearInterval(heartbeatInterval);

        this.clients.delete(user.id);
        console.log(
            `Removed user ${user.username} from clients map. Remaining clients: ${this.clients.size}`
        );

        // Notify other players about disconnection
        const disconnectMessage: GameMessage = {
            type: "PLAYER_DISCONNECTED",
            player: user.username,
        };
        this.broadcast(code, disconnectMessage);
    }

    async handleGameStart(code: string): Promise<void> {
        try {
            const tempGame = GameStore.getTempGame(code);
            if (!tempGame) {
                throw new Error("Temp game not found");
            }
            if (tempGame.players.length < 2) {
                throw new Error("Not enough players to start the game");
            }

            const newGame = await Game.create();
            GameStore.deleteTempGame(code);

            const gameStartMessage: GameMessage = {
                type: "GAME_STARTED",
                game: newGame.toDTO(),
            };

            this.broadcast(code, gameStartMessage);
            console.log(`Game started successfully with ID: ${newGame.id}`);
        } catch (error) {
            console.error(`Failed to start game ${code}:`, error);
            const errorMessage: GameMessage = {
                type: "ERROR",
                message: "Failed to start game",
            };
            this.broadcast(code, errorMessage);
        }
    }

    setupConnectionHandlers(
        connection: WebSocket,
        code: string,
        user: User,
        heartbeatInterval: NodeJS.Timeout
    ): void {
        // Handle connection close
        connection.on("close", (closeCode: number, reason: Buffer) => {
            const reasonText = `close code: ${closeCode}, reason: ${reason.toString()}`;
            this.handlePlayerDisconnection(
                user,
                code,
                heartbeatInterval,
                reasonText
            );
        });

        // Handle connection errors
        connection.on("error", (error: Error) => {
            const reasonText = `error: ${error.message}`;
            this.handlePlayerDisconnection(
                user,
                code,
                heartbeatInterval,
                reasonText
            );
        });

        // Handle unexpected responses
        connection.on("unexpected-response", () => {
            console.log(
                `Unexpected response for user ${user.username} in game ${code}`
            );
        });

        connection.on("message", (message: any) => {
            console.log(
                `Received message from user ${user.username} in game ${code}: ${message}`
            );
            const data = JSON.parse(message);
            console.log(data);
            if (data.type === "START_GAME") this.handleGameStart(code);
            // Handle incoming messages as needed
        });
    }
}

const GameWebSocketServiceInstance = new GameWebSocketService();

export default GameWebSocketServiceInstance;
