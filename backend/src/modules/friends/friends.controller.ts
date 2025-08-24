import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, GET, POST } from "fastify-decorators";
import { BaseController } from "../base";
import jwtService from "../auth/services/jwt.service";
import friendsService from "./services/user.friends";
import { User } from "@/database/models/User/User";

@Controller("/friends")
export class FriendsController extends BaseController {
    @GET("/all")
    async getFriends(request: FastifyRequest, reply: FastifyReply) {
        const token = request.cookies.session;
        const { id } = jwtService.verify(token);

        const user = await User.findByPk(id);
        if (!user) {
            return reply.status(404).send({ error: "User not found" });
        }

        return reply.send(user.getFriends());
    }

    @GET("/requests")
    async getFriendRequests(request: FastifyRequest, reply: FastifyReply) {
        const token = request.cookies.session;
        const { id } = jwtService.verify(token);

        const user = await User.findByPk(id);
        if (!user) {
            return reply.status(404).send({ error: "User not found" });
        }

        return reply.send(user.getFriendRequests());
    }

    @GET("/requests/sent")
    async getAllSentRequests(request: FastifyRequest, reply: FastifyReply) {
        const token = request.cookies.session;
        const { id } = jwtService.verify(token);
        const sentRequests = await friendsService.getAllSentRequests(id);
        return reply.send(sentRequests);
    }

    @POST("/add")
    async addFriend(request: FastifyRequest, reply: FastifyReply) {
        const token = request.cookies.session;
        const { id } = jwtService.verify(token);
        const { friendId } = request.body as { friendId: number };

        const user = await User.findByPk(id);
        if (!user) {
            return reply.status(404).send({ error: "User not found" });
        }

        user.askFriendRequest(friendId);

        return reply.send({ success: true });
    }

    @POST("/accept")
    async acceptFriend(request: FastifyRequest, reply: FastifyReply) {
        const token = request.cookies.session;
        const { id } = jwtService.verify(token);
        const { friendId } = request.body as { friendId: number };

        const user = await User.findByPk(id);
        if (!user) {
            return reply.status(404).send({ error: "User not found" });
        }

        user.acceptFriendRequest(friendId);

        return reply.send({ success: true });
    }

    @POST("/remove")
    async removeFriend(request: FastifyRequest, reply: FastifyReply) {
        const token = request.cookies.session;
        const { id } = jwtService.verify(token);
        const { friendId } = request.body as { friendId: number };

        const user = await User.findByPk(id);
        if (!user) {
            return reply.status(404).send({ error: "User not found" });
        }

        user.removeFriend(friendId);

        return reply.send({ success: true });
    }
}
