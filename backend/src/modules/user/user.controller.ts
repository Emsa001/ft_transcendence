import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, GET } from "fastify-decorators";

import { BaseController } from "../base";
import { UserGamesService } from "./services/user.games";
import { User } from "@/database/models/User/User";

@Controller("/user")
export class UserController extends BaseController {
    @GET("/")
    async getUsers(_: FastifyRequest, reply: FastifyReply) {
        const users = await User.findAll();
        return reply.send(users.map((user) => user.toDTO()));
    }

    @GET("/:id")
    async getUserById(request: FastifyRequest, reply: FastifyReply) {
        const userId = Number((request.params as { id: string }).id);
        const user = await User.findByPk(userId);

        return reply.send(user?.toDTO());
    }

    @GET("/:userId/history")
    async getUserGameHistory(request: FastifyRequest, reply: FastifyReply) {
        const { userId } = request.params as { userId?: string };
        if (!userId) {
            return reply.status(401).send({ error: "userId is required" });
        }

        const games = await UserGamesService.getHistory(Number(userId));

        return reply.send(games.map((game) => game.toDTO()));
    }
}
