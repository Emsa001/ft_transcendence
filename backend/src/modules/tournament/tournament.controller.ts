import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, GET, POST } from "fastify-decorators";

import { BaseController } from "../base";
import { HttpException } from "@/utils/exceptions";
import { Tournament } from "@/database/models/Tournaments/Tournament";
import { UserGenerate } from "@/database/models/User/UserGenerate";
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
        const { name, maxPlayers, maxScore, isPrivate } = request.body as {
            name: string;
            maxPlayers: number;
            maxScore: number;
            isPrivate: boolean;
        };

        const tournament = await Tournament.create({
            name,
            maxPlayers,
            maxScore,
            isPrivate,
            hostId: request.user.id,
        });

        await tournament.reload({ include: ["players"] });
        TournamentRooms.create(tournament);

        return reply.status(201).send(tournament.toDTO());
    }

    @GET("/join/:uuid", { websocket: true })
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

        /*

            const { code } = request.params as { code: string };
            const user = request.user;
    
            const room = GameRooms.get(code);
            if (!room) {
                connection.close(4004, "Room not found");
                return;
            }
            if (room.game.status === GameStatus.FINISHED) {
                connection.close(4004, "Game has already finished");
                return;
            }
            room.addPlayer(connection, user);

        */
    }
}
