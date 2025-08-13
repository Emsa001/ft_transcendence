import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, GET } from "fastify-decorators";

import { BaseController } from "../base";
import { Game } from "@/database/models/Game/Game";
import { HttpException } from "@/utils/exceptions";
import { User } from "@/database/models/User/User";

@Controller("/game")
export class GameController extends BaseController {
    @GET("/all")
    async getGames(_: FastifyRequest, reply: FastifyReply) {
        const games = await Game.findAll({
            include: [{ model: User, as: "players" }],
        });
        return reply.send(games.map((game) => game.toDTO()));
    }

    @GET("/:id")
    async getGameById(request: FastifyRequest, reply: FastifyReply) {
        const gameId = Number((request.params as { id: string }).id);
        const game = await Game.findByPk(gameId, {
            include: [{ model: User, as: "players" }],
        });
        if (!game) throw new HttpException(404, "Game not found");

        return reply.send(game.toDTO());
    }
}
