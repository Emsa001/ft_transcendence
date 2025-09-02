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
        this.onClientConnect(connection);

        if (!this.clients.has(userId)) this.clients.set(userId, []);

        this.clients.get(userId)!.push(connection);

        connection.on("message", (data) => {
            this.onMessage(connection, data);
        });

        connection.on("close", () => {
            this.removeClient(userId, connection);
        });
    }

    removeClient(userId: number, connection: WebSocket) {
        this.onClientDisconnect(connection);

        const userConnections = this.clients.get(userId);
        if (userConnections) {
            const filteredConnections = userConnections.filter(
                (conn) => conn !== connection
            );
            if (filteredConnections.length === 0) this.clients.delete(userId);
            else this.clients.set(userId, filteredConnections);
        }
    }

    getClient(userId: number): WebSocket[] {
        return this.clients.get(userId) || [];
    }

    getClients() {
        return this.clients;
    }

    getUserId(connection: WebSocket): number | null {
        for (const [userId, sockets] of this.clients) {
            if (sockets.includes(connection)) {
                return userId;
            }
        }
        return null;
    }

    protected onClientConnect(connection: WebSocket) {}
    protected onClientDisconnect(connection: WebSocket) {}
    protected onMessage(connection: WebSocket, message: any) {}
}
