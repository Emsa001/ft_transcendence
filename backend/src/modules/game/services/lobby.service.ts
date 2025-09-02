import { WebSocket } from "@fastify/websocket";
import { WebSocketService } from "@/lib/WebSocketService";
import { GameRooms } from "./registry.service";

class GameLobbyService extends WebSocketService {
    constructor() {
        super();
        GameRooms.addHook("onGameCreate", this.updateLobby.bind(this));
        GameRooms.addHook("onGameDelete", this.updateLobby.bind(this));
        GameRooms.addHook(
            "onGameAvailabilityChange",
            this.updateLobby.bind(this)
        );
    }

    private updatePlayer(client: WebSocket) {
        const publicRooms = GameRooms.getPublicWaitingRooms();
        this.sendToClient(client, {
            type: "lobby_update",
            games: publicRooms.length,
        });
    }

    addPlayer(userId: number, connection: WebSocket) {
        super.addClient(userId, connection);
        this.updatePlayer(connection);
    }

    updateLobby() {
        const publicRooms = GameRooms.getPublicWaitingRooms();
        this.broadcast({ type: "lobby_update", games: publicRooms.length });
    }

    protected onMessage(connection: WebSocket, message: any): void {
        const user = this.getUserId(connection);
        if (!user) return;

        const payload = JSON.parse(message);
        switch (payload.type) {
            case "GET_LOBBY":
                this.updatePlayer(connection);
                break;

            default:
                console.warn("Unknown message type in lobby:", payload.type);
        }
    }

    protected onClientDisconnect(connection: WebSocket): void {}

    protected onClientConnect(connection: WebSocket): void {}
}

export const GameLobbyServiceInstance = new GameLobbyService();
export default GameLobbyServiceInstance;
