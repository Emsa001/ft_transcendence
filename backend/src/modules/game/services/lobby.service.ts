import { WebSocket } from "@fastify/websocket";
import { WebSocketService } from "@/lib/WebSocketService";
import GameStoreInstance from "./storage.service";

class GameLobbyService extends WebSocketService {
    constructor() {
        super();
        GameStoreInstance.addHook("onGameCreate", this.updateLobby.bind(this));
        GameStoreInstance.addHook("onGameDelete", this.updateLobby.bind(this));
    }

    private updateClient(client: WebSocket) {
        const publicGames = GameStoreInstance.getPublicGames();
        this.sendToClient(client, {
            type: "lobby_update",
            games: publicGames.length,
        });
    }

    addClient(userId: number, connection: WebSocket) {
        super.addClient(userId, connection);
        this.updateClient(connection);
    }

    updateLobby() {
        const publicGames = GameStoreInstance.getPublicGames();
        this.broadcast({ type: "lobby_update", games: publicGames.length });
    }

    protected onRemoveClient(connection: WebSocket): void {
        console.log("A player disconnected from the game lobby");
    }

    protected onAddClient(connection: WebSocket): void {
        console.log("A player connected to the game lobby");
    }
}

export const GameLobbyServiceInstance = new GameLobbyService();
export default GameLobbyServiceInstance;
