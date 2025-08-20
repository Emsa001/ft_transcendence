import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, GET, POST } from "fastify-decorators";
import { BaseController } from "../base";
import jwtService from "../auth/services/jwt.service";
import friendsService from "./services/user.friends";

@Controller("/friends")
export class FriendsController extends BaseController {
    @GET("/all")
    async getFriends(request: FastifyRequest, reply: FastifyReply) {
        const token = request.cookies.session;
        const { id } = jwtService.verify(token);
        const friends = await friendsService.getFriends(id);
        return reply.send(friends);
    }

    @GET("/requests")
    async getFriendRequests(request: FastifyRequest, reply: FastifyReply) {
        const token = request.cookies.session;
        const { id } = jwtService.verify(token);
        const friendRequests = await friendsService.getFriendRequests(id);
        return reply.send(friendRequests);
    }

    @POST("/add")
    async addFriend(request: FastifyRequest, reply: FastifyReply) {
        const token = request.cookies.session;
        const { id } = jwtService.verify(token);
        const { friendId } = request.body as { friendId: number };

        await friendsService.askFriendRequest(id, friendId);

        return reply.send({ success: true });
    }

    @POST("/accept")
    async acceptFriend(request: FastifyRequest, reply: FastifyReply) {
        const token = request.cookies.session;
        const { id } = jwtService.verify(token);
        const { friendId } = request.body as { friendId: number };

        await friendsService.acceptFriendRequest(friendId, id);

        return reply.send({ success: true });
    }

    @POST("/remove")
    async removeFriend(request: FastifyRequest, reply: FastifyReply) {
        const token = request.cookies.session;
        const { id } = jwtService.verify(token);
        const { friendId } = request.body as { friendId: number };

        await friendsService.removeFriend(id, friendId);

        return reply.send({ success: true });
    }
}
