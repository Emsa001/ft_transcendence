import { WebSocket } from "@fastify/websocket";

import { User } from "@/database/models/User/User";
import { WebSocketService } from "@/lib/WebSocketService";

import GameStore from "./storage.service";

class GameRoomService extends WebSocketService {
    constructor() {
        super();
    }

    addPlayer(connection: WebSocket, code: string, user: User) {
        GameStore.addPlayer(code, user.id);
        this.addClient(user.id, connection);
        this.broadcast({ type: "PLAYER_JOINED" });
    }

    protected onAddClient(connection: WebSocket): void {
        console.log("A player connected to the game room");
    }

    protected onRemoveClient(connection: WebSocket): void {
        console.log("A player disconnected from the game room");
        this.broadcast({ type: "PLAYER_DISCONNECTED" });
    }
}

const GameRoomServiceInstance = new GameRoomService();
export default GameRoomServiceInstance;
