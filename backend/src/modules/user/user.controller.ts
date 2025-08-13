import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, GET } from "fastify-decorators";

import { BaseController } from "../base";
import { UserGamesService } from "./services/user.games";
import { User } from "@/database/models/User/User";

@Controller("/user")
export class UserController extends BaseController {
    @GET("/all")
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

    @GET("/:id/history")
    async getUserGameHistory(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id?: string };
        if (!id) {
            return reply.status(401).send({ error: "id is required" });
        }

        const games = await UserGamesService.getHistory(Number(id));

        return reply.send(games.map((game) => game.toDTO()));
    }
}
