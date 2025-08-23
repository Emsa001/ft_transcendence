import { WebSocket } from "@fastify/websocket";

class UserStatusService {
    private connections: Map<string, Set<WebSocket>> = new Map();

    public addUser(userId: string, socket: WebSocket) {
        if (!this.connections.has(userId)) {
            this.connections.set(userId, new Set<WebSocket>());
        }
        this.connections.get(userId)!.add(socket);

        this.broadcastOnlineUsers();
    }

    public removeUser(userId: string, socket: WebSocket) {
        if (this.connections.has(userId)) {
            this.connections.get(userId)!.delete(socket);

            if (this.connections.get(userId)!.size === 0) {
                this.connections.delete(userId);
            }
        }

        this.broadcastOnlineUsers();
    }

    private getOnlineUsersPayload() {
        return JSON.stringify({
            type: "online_users",
            onlineUsers: Array.from(this.connections.keys()),
        });
    }

    private broadcastOnlineUsers() {
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

const userStatusService = new UserStatusService();
export default userStatusService;
