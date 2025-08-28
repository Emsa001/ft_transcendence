import { WebSocket } from "@fastify/websocket";
import { MessageDTOType } from "shared";

class ChatWSService {
    private connections: Map<number, Set<WebSocket>> = new Map();

    public addUser(userId: number, socket: WebSocket) {
        if (!this.connections.has(userId)) {
            this.connections.set(userId, new Set<WebSocket>());
        }
        this.connections.get(userId)!.add(socket);
    }

    public removeUser(userId: number, socket: WebSocket) {
        if (this.connections.has(userId)) {
            this.connections.get(userId)!.delete(socket);

            if (this.connections.get(userId)!.size === 0) {
                this.connections.delete(userId);
            }
        }
    }

    public handleMessage(msg: MessageDTOType) {
        const payload = JSON.stringify({
            sender: msg.sender,
            receiver: msg.receiver,
            message: msg.message,
        });

        if (msg.receiver && this.connections.has(msg.receiver)) {
            for (const socket of this.connections.get(msg.receiver)!) {
                if (socket.readyState === 1) {
                    socket.send(payload);
                }
            }
        }
    }
}

const chatWSService = new ChatWSService();
export { chatWSService };
