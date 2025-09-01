import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, GET, POST } from "fastify-decorators";

import { BaseController } from "../base";
import { Game } from "@/database/models/Game/Game";
import { HttpException } from "@/utils/exceptions";
import { AUTHORIZED, WS_AUTHORIZED } from "../auth/auth.middleware";
import { WebSocket } from "@fastify/websocket";
import { GameCreationAttributes } from "shared";

import GameStore from "./services/storage.service";
import GameRoomService from "./services/room.service";
import GameLobbyService from "./services/lobby.service";

@Controller("/game")
export class GameController extends BaseController {
    @GET("/all")
    async getGames(_: FastifyRequest, reply: FastifyReply) {
        const games = await Game.findAll();
        return reply.send(games.map((game) => game.toDTO()));
    }

    // ONLY FOR TEMP GAMES
    @GET("/code/:code")
    @AUTHORIZED
    async getGameByCode(request: FastifyRequest, reply: FastifyReply) {
        const { code } = request.params as { code: string };
        const game = GameStore.getGame(code);
        if (!game) throw new HttpException(404, "Game not found");

        return reply.send(game);
    }

    @POST("/create")
    @AUTHORIZED
    async createGame(request: FastifyRequest, reply: FastifyReply) {
        const data = request.body as GameCreationAttributes;
        const tempGame = GameStore.createTempGame(request.user.id, data);

        return reply.send(tempGame.code);
    }

    @GET("/lobby", { websocket: true })
    @WS_AUTHORIZED
    async joinLobby(connection: WebSocket, request: FastifyRequest) {
        const user = request.user;

        GameLobbyService.addClient(user.id, connection);
    }

    @GET("/play/:code", { websocket: true })
    @WS_AUTHORIZED
    async joinGame(connection: WebSocket, request: FastifyRequest) {
        const { code } = request.params as { code: string };
        const user = request.user;

        GameRoomService.addPlayer(connection, code, user);
    }
}
