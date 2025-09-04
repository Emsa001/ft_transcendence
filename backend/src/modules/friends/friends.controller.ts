import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, GET, POST } from "fastify-decorators";
import { BaseController } from "../base";
import { AUTHORIZED } from "../auth/auth.middleware";
import jwtService from "../auth/services/jwt.service";
import { WebSocket } from "@fastify/websocket";
import { friendsWSService } from "./services/ws.friends";

@Controller("/friends")
export class FriendsController extends BaseController {
    @GET("/", { websocket: true })
    async friendsSockets(connection: WebSocket, req: FastifyRequest) {
        try {
            const token = req.cookies.session;
            let userId = jwtService.verify(token).id;
            friendsWSService.addUser(userId, connection);

            connection.on("close", () => {
                friendsWSService.removeUser(userId, connection);
            });
        } catch (err) {
            connection.close();
        }
    }

    @GET("/all")
    @AUTHORIZED
    async getFriends(request: FastifyRequest, reply: FastifyReply) {
        return reply.send(await request.user.getFriends());
    }

    @GET("/requests")
    @AUTHORIZED
    async getFriendRequests(request: FastifyRequest, reply: FastifyReply) {
        return reply.send(await request.user.getFriendRequests());
    }

    @POST("/add")
    @AUTHORIZED
    async addFriend(request: FastifyRequest, reply: FastifyReply) {
        const { friendId } = request.body as { friendId: number };
        await request.user.askFriendRequest(friendId);
        friendsWSService.notifyUser(friendId, "NEW_FRIEND_REQUEST");
        return reply.send({ success: true });
    }

    @POST("/accept")
    @AUTHORIZED
    async acceptFriend(request: FastifyRequest, reply: FastifyReply) {
        const { friendId } = request.body as { friendId: number };
        await request.user.acceptFriendRequest(friendId);
        friendsWSService.notifyUser(friendId, "FRIEND_REQUEST_ACCEPTED");
        return reply.send({ success: true });
    }

    @POST("/remove")
    @AUTHORIZED
    async removeFriend(request: FastifyRequest, reply: FastifyReply) {
        const { friendId } = request.body as { friendId: number };
        await request.user.removeFriend(friendId);
        friendsWSService.notifyUser(friendId, "FRIEND_REMOVED");
        return reply.send({ success: true });
    }

    @GET("/requests/sent")
    @AUTHORIZED
    async getAllSentRequests(request: FastifyRequest, reply: FastifyReply) {
        return reply.send(await request.user.getAllSentRequests());
    }
}
