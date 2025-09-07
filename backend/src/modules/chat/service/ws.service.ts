import { WebSocket } from "@fastify/websocket";
import { MessageDTOType } from "shared";
import { chatDBService } from "./db.service";
import { BlockUserService } from "@/modules/user/services/user.block";
import { Message } from "@/database/models/Message/Message";

class ChatWSService {
    private connections: Map<number, Set<WebSocket>> = new Map();
    private lastMessageTime: Map<number, number> = new Map();

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

    public async handleMessage(msg: MessageDTOType) {
        const now = Date.now();
        if (
            (await BlockUserService.isBlocked(msg.sender, msg.receiver)) ||
            msg.receiver === -1
        ) {
            const errorPayload = JSON.stringify({
                type: "error",
                code: "BLOCKED_USER",
                message: "Cannot send message to this user",
                originalMessage: msg.message,
            });

            if (this.connections.has(msg.sender)) {
                for (const socket of this.connections.get(msg.sender)!) {
                    if (socket.readyState === 1) {
                        socket.send(errorPayload);
                    }
                }
            }
            return;
        }

        if (!msg.message || msg.message.length > 500) {
            return;
        }

        if (msg.sender != -1) {
            const last = this.lastMessageTime.get(msg.sender) || 0;
            if (now - last < 100) {
                return;
            }

            this.lastMessageTime.set(msg.sender, now);
        }

        const message = await Message.create(msg);

        const payload = JSON.stringify({
            type: "message",
            ...message,
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
