import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, GET } from "fastify-decorators";
import { BaseController } from "../base";
import jwtService from "../auth/services/jwt.service";
import { WebSocket } from "@fastify/websocket";
import { chatWSService } from "./service/ws.service";
import { AUTHORIZED } from "../auth/auth.middleware";

@Controller("/chat")
export class ChatController extends BaseController {
    @GET("/", { websocket: true })
    async chatSockets(connection: WebSocket, req: FastifyRequest) {
        try {
            const token = req.cookies.session;
            let userId = jwtService.verify(token).id;

            chatWSService.addUser(userId, connection);
            connection.on("message", (raw: Buffer) => {
                try {
                    const msg = JSON.parse(raw.toString());
                    chatWSService.handleMessage(msg);
                } catch (err) {
                    console.error("Invalid message format:", err);
                }
            });

            connection.on("close", () => {
                chatWSService.removeUser(userId, connection);
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
