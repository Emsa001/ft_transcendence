import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, GET, POST } from "fastify-decorators";

import { BaseController } from "../base";
import { Game } from "@/database/models/Game/Game";
import { AUTHORIZED, WS_AUTHORIZED } from "../auth/auth.middleware";
import { WebSocket } from "@fastify/websocket";
import { GameCreationAttributes, GameStatus } from "shared";

import GameLobbyService from "./services/lobby.service";
import { GameRooms } from "./services/registry.service";
import { HttpException } from "@/utils/exceptions";

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
        const game = await Game.findByCode(code);
        return reply.send(game?.toDTO());
    }

    @POST("/create")
    @AUTHORIZED
    async createGame(request: FastifyRequest, reply: FastifyReply) {
        const data = request.body as GameCreationAttributes;
        const room = await Game.create({
            hostId: request.user.id,
            isPrivate: data.isPrivate || false,
            maxScore: data.maxScore || 7,
        });

        await room.reload({ include: ["players"] });

        console.log(room.players);
        GameRooms.create(room);
        console.log(`Game created with code: ${room.code}`);

        return reply.send(room.toDTO());
    }

    @GET("/lobby", { websocket: true })
    @WS_AUTHORIZED
    async joinLobby(connection: WebSocket, request: FastifyRequest) {
        const user = request.user;
        GameLobbyService.addPlayer(user.id, connection);
    }

    @GET("/play/:code", { websocket: true })
    @WS_AUTHORIZED
    async joinGame(connection: WebSocket, request: FastifyRequest) {
        const { code } = request.params as { code: string };
        const user = request.user;

        const room = GameRooms.get(code);
        if (!room) {
            connection.close();
            return;
        }
        if (room.game.status === GameStatus.FINISHED) {
            connection.close();
            throw new HttpException(400, "Game has already finished");
        }
        room.addPlayer(connection, user);
    }

    @GET("/random")
    @AUTHORIZED
    async joinRandom(request: FastifyRequest, reply: FastifyReply) {
        const publicRooms = GameRooms.getPublicWaitingRooms();
        if (publicRooms.length === 0) {
            return reply.status(404).send({ message: "No available games" });
        }
        const room =
            publicRooms[Math.floor(Math.random() * publicRooms.length)];
        return reply.send(room.game.toDTO());
    }
}
