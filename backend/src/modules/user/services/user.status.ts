import { WebSocket } from "@fastify/websocket";

export class UserStatusService {
    static connections: Map<number, Set<WebSocket>> = new Map();

    static addUser(userId: number, socket: WebSocket) {
        if (!this.connections.has(userId)) {
            this.connections.set(userId, new Set<WebSocket>());
        }
        this.connections.get(userId)!.add(socket);

        this.broadcastOnlineUsers();
    }

    static removeUser(userId: number, socket: WebSocket) {
        if (this.connections.has(userId)) {
            this.connections.get(userId)!.delete(socket);

            if (this.connections.get(userId)!.size === 0) {
                this.connections.delete(userId);
            }
        }

        this.broadcastOnlineUsers();
    }

    static getOnlineUsersPayload() {
        return JSON.stringify({
            type: "online_users",
            onlineUsers: Array.from(this.connections.keys()),
        });
    }

    static getMessagePayload(sender: string, message: string) {
        return JSON.stringify({
            type: "message",
            sender,
            message,
        });
    }

    static sendMessageToUser(sender: string, userId: number, message: string) {
        const payload = this.getMessagePayload(sender, message);
        const sockets = this.connections.get(userId);
        if (sockets) {
            for (const socket of sockets) {
                if (socket.readyState === 1) {
                    socket.send(payload);
                }
            }
        }
    }

    static broadcastOnlineUsers() {
        const payload = this.getOnlineUsersPayload();
        for (const sockets of this.connections.values()) {
            for (const socket of sockets) {
                if (socket.readyState === 1) {
                    socket.send(payload);
                }
            }
        }
    }
}
