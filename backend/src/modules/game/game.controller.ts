import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, GET, POST } from "fastify-decorators";

import { BaseController } from "../base";
import { Game } from "@/database/models/Game/Game";
import { HttpException } from "@/utils/exceptions";
import { AUTHORIZED, WS_AUTHORIZED } from "../auth/auth.middleware";
import { GameStore } from "./services/storage.service";
import { WebSocket } from "@fastify/websocket";
import GameWebSocketService from "./services/websocket.service";

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

    @POST("/create")
    @AUTHORIZED
    async createGame(request: FastifyRequest, reply: FastifyReply) {
        const tempGame = GameStore.createTempGame();
        console.log(`Created temp game with code ${tempGame.code}`);
        return reply.send({ code: tempGame.code });
    }

    @GET("/play/:code", { websocket: true })
    @WS_AUTHORIZED
    async joinGame(connection: WebSocket, request: FastifyRequest) {
        const { code } = request.params as { code: string };
        const user = request.user;

        // Validate game exists
        if (!GameWebSocketService.validateGameExists(connection, code)) return;

        console.log(`User ${user.username} connecting to game ${code}`);
        console.log(`WebSocket readyState: ${connection.readyState}`);

        // Add player to game and clients
        GameWebSocketService.addPlayerToGame(connection, code, user);
        const heartbeatInterval = GameWebSocketService.setupHeartbeat(
            connection,
            user,
            code
        );
        GameWebSocketService.setupConnectionHandlers(
            connection,
            code,
            user,
            heartbeatInterval
        );
    }
}
