import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, GET } from "fastify-decorators";
import { BaseController } from "../base";
import { WebSocket } from "@fastify/websocket";
import { chatWSService } from "./service/ws.service";
import { AUTHORIZED, WS_AUTHORIZED } from "../auth/auth.middleware";
import { UserStatusService } from "../user/services/user.status";

@Controller("/chat")
export class ChatController extends BaseController {
    @GET("/", { websocket: true })
    @WS_AUTHORIZED
    async chatSockets(connection: WebSocket, req: FastifyRequest) {
        try {
            const user = req.user.id;

            chatWSService.addUser(user, connection);
            connection.on("message", (raw: Buffer) => {
                try {
                    const msg = JSON.parse(raw.toString());
                    chatWSService.handleMessage(msg);
                    UserStatusService.sendMessageToUser(
                        req.user.username,
                        msg.receiver,
                        msg.message
                    );
                } catch (err) {
                    console.error("Invalid message format:", err);
                }
            });

            connection.on("close", () => {
                chatWSService.removeUser(user, connection);
            });
        } catch (err) {
            connection.close();
        }
    }

    @GET("/get/:id")
    @AUTHORIZED
    async getChat(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: number };
        const { offset } = request.query as { offset: number };

        const data = await request.user.findChat(id, {
            limit: 20,
            offset,
            order: [["createdAt", "DESC"]],
        });

        return reply.send(data);
    }
}
