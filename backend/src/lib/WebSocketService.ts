import type WebSocket from "ws";

export class WebSocketService {
    private clients: Map<number, WebSocket[]> = new Map();

    sendToClient(client: WebSocket, message: any) {
        if (client && client.readyState === client.OPEN) {
            client.send(JSON.stringify(message));
        }
    }

    broadcast(message: any) {
        for (const [, sockets] of this.clients) {
            for (const client of sockets) {
                this.sendToClient(client, message);
            }
        }
    }

    addClient(userId: number, connection: WebSocket) {
        if (!this.clients.has(userId)) {
            this.clients.set(userId, []);
        }
        this.clients.get(userId)!.push(connection);
        this.onAddClient(connection);

        connection.on("close", () => {
            this.removeClient(userId, connection);
        });
    }

    removeClient(userId: number, connection: WebSocket) {
        const userConnections = this.clients.get(userId);
        if (userConnections) {
            this.clients.set(
                userId,
                userConnections.filter((conn) => conn !== connection)
            );
        }
        this.onRemoveClient(connection);
    }

    getClients(userId: number): WebSocket[] {
        return this.clients.get(userId) || [];
    }

    protected onRemoveClient(connection: WebSocket) {}
    protected onAddClient(connection: WebSocket) {}
}
