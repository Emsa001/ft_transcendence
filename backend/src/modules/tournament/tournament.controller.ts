import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, GET, POST } from "fastify-decorators";

import { BaseController } from "../base";
import { HttpException } from "@/utils/exceptions";
import { Tournament } from "@/database/models/Tournaments/Tournament";
import { GameStatus } from "shared";
import { AUTHORIZED, WS_AUTHORIZED } from "../auth/auth.middleware";
import { TournamentRooms } from "./services/registry.service";
import { WebSocket } from "@fastify/websocket";

@Controller("/tournament")
export class TournamentController extends BaseController {
    @GET("/all")
    async getAll(request: FastifyRequest, reply: FastifyReply) {
        const { status, offset } = request.query as {
            status?: GameStatus;
            offset?: string;
        };

        const where = status ? { status } : undefined;
        const limit = 20;
        const offsetNum = offset ? Number(offset) : 0;

        const tournaments = await Tournament.findAll({
            order: [["createdAt", "DESC"]],
            limit: limit + 1,
            offset: offsetNum,
            where,
        });

        const hasMore = tournaments.length > limit;
        const tournamentsToSend = hasMore
            ? tournaments.slice(0, limit)
            : tournaments;

        return reply.send({
            tournaments: tournamentsToSend.map((tournament) =>
                tournament.toDTO()
            ),
            hasMore,
        });
    }

    @GET("/:uuid")
    async getTournamentByUUID(request: FastifyRequest, reply: FastifyReply) {
        const uuid = (request.params as { uuid: string }).uuid;
        const tournament = await Tournament.findByUUID(uuid);
        if (!tournament) throw new HttpException(404, "Tournament not found");

        return reply.send(await tournament.toDTO().withGames());
    }

    @POST("/create")
    @AUTHORIZED
    async createTournament(request: FastifyRequest, reply: FastifyReply) {
        const { name, maxPlayers, maxScore, randomEvents } = request.body as {
            name: string;
            maxPlayers: number;
            maxScore: number;
            randomEvents: boolean;
        };

        if (name.length < 2 || name.length > 32) {
            throw new HttpException(400, "Invalid tournament name");
        }
        if (maxPlayers < 2 || maxPlayers > 32) {
            throw new HttpException(
                400,
                "Max players must be between 2 and 32"
            );
        }
        if (maxScore < 1 || maxScore > 100) {
            throw new HttpException(400, "Max score must be between 1 and 100");
        }

        const tournament = await Tournament.create({
            name,
            maxPlayers,
            maxScore,
            randomEvents,
            hostId: request.user.id,
        });

        await tournament.reload({ include: ["players"] });
        TournamentRooms.create(tournament);

        return reply.status(201).send(tournament.toDTO());
    }

    @POST("/:uuid/start")
    @AUTHORIZED
    async startTournament(request: FastifyRequest, reply: FastifyReply) {
        const { uuid } = request.params as { uuid: string };

        const room = TournamentRooms.get(uuid);
        if (!room) throw new HttpException(500, "Tournament room not found");
        if (room.tournament.hostId !== request.user.id) {
            throw new HttpException(
                403,
                "Only the host can start the tournament"
            );
        }

        await room.start();

        return reply.send({ message: "Tournament started" });
    }

    @GET("/:uuid/join", { websocket: true })
    @WS_AUTHORIZED
    async joinGame(connection: WebSocket, request: FastifyRequest) {
        const { uuid } = request.params as { uuid: string };

        const room = TournamentRooms.get(uuid);
        if (!room) {
            connection.close(4004, "Room not found");
            return;
        }

        if (room.tournament.status === GameStatus.FINISHED) {
            connection.close(4004, "Game has already finished");
            return;
        }

        await room.addPlayer(connection, request.user);
    }
}
