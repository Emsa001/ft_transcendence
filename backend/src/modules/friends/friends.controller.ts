import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, GET, POST } from "fastify-decorators";
import { BaseController } from "../base";
import { AUTHORIZED } from "../auth/auth.middleware";

@Controller("/friends")
export class FriendsController extends BaseController {

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
        return reply.send({ success: true });
    }

    @POST("/accept")
    @AUTHORIZED
    async acceptFriend(request: FastifyRequest, reply: FastifyReply) {
        const { friendId } = request.body as { friendId: number };
        await request.user.acceptFriendRequest(friendId);
        return reply.send({ success: true });
    }

    @POST("/remove")
    @AUTHORIZED
    async removeFriend(request: FastifyRequest, reply: FastifyReply) {
        const { friendId } = request.body as { friendId: number };
        await request.user.removeFriend(friendId);
        return reply.send({ success: true });
    }

    @GET("/requests/sent")
    @AUTHORIZED
    async getAllSentRequests(request: FastifyRequest, reply: FastifyReply) {
        return reply.send(await request.user.getAllSentRequests());
    }
}
