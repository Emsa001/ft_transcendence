import { WebSocket } from "@fastify/websocket";

class FriendsWSService {
    private clients = new Map<number, Set<WebSocket>>();

    public addUser(userId: number, socket: WebSocket) {
        if (!this.clients.has(userId)) {
            this.clients.set(userId, new Set<WebSocket>());
        }
        this.clients.get(userId)!.add(socket);
    }

    public removeUser(userId: number, socket: WebSocket) {
        if (this.clients.has(userId)) {
            this.clients.get(userId)!.delete(socket);

            if (this.clients.get(userId)!.size === 0) {
                this.clients.delete(userId);
            }
        }
    }

    public notifyUser(userId: number, type: string) {
        const payload = JSON.stringify({
            type: type,
        });
        this.clients.forEach((client, id) => {
            client.forEach((socket) => {
                if (socket.readyState === 1 && id === userId) {
                    socket.send(payload);
                }
            });
        });
    }
}

const friendsWSService = new FriendsWSService();
export { friendsWSService };
