import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, GET } from "fastify-decorators";

import { BaseController } from "../base";
import { Game, GameStatus } from "@/database/models/Game/Game";
import { HttpException } from "@/utils/exceptions";
import { User } from "@/database/models/User/User";
import { UserExample } from "@/database/models/User/UserExample";

@Controller("/game")
export class GameController extends BaseController {
    @GET("/all")
    async getGames(_: FastifyRequest, reply: FastifyReply) {
        const games = await Game.findAll();
        return reply.send(games.map((game) => game.toDTO()));
    }

    @GET("/:id")
    async getGameById(request: FastifyRequest, reply: FastifyReply) {
        const gameId = Number((request.params as { id: string }).id);
        const game = await Game.findByPk(gameId);
        if (!game) throw new HttpException(404, "Game not found");

        return reply.send(game.toDTO());
    }

    @GET("/test")
    async testGame(request: FastifyRequest, reply: FastifyReply) {
        const game = await Game.create();

        const user1 = await UserExample.create();
        const user2 = await UserExample.create();

        await game.addPlayer(user1);
        await game.addPlayer(user2);

        game.status = GameStatus.IN_PROGRESS;

        await game.playerScore(user1.id, 10);
        await game.playerScore(user2.id, 20);

        game.status = GameStatus.FINISHED;
        await game.save();

        return reply.send(game.toDTO());
    }
}
