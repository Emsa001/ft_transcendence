import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, GET } from "fastify-decorators";

import { BaseController } from "../base";
import { HttpException } from "@/utils/exceptions";
import { Tournament } from "@/database/models/Tournaments/Tournament";
import { UserGenerate } from "@/database/models/User/UserGenerate";
import { tournamentExampleRoundFlow } from "./services/tournament.flow";
import { GameStatus } from "shared";

@Controller("/tournament")
export class TournamentController extends BaseController {
    @GET("/all")
    async getTournaments(_: FastifyRequest, reply: FastifyReply) {
        const tournaments = await Tournament.findAll();
        return reply.send(tournaments.map((tournament) => tournament.toDTO()));
    }

    @GET("/:id")
    async getTournamentById(request: FastifyRequest, reply: FastifyReply) {
        const tournamentId = Number((request.params as { id: string }).id);
        const tournament = await Tournament.findByPk(tournamentId);
        if (!tournament) throw new HttpException(404, "Tournament not found");

        return reply.send(await tournament.toDTO().withGames());
    }

    @GET("/join/:id")
    async joinTournament(request: FastifyRequest, reply: FastifyReply) {
        const tournamentId = Number((request.params as { id: string }).id);
        const tournament = await Tournament.findByPk(tournamentId);
        if (!tournament) throw new HttpException(404, "Tournament not found");

        const user = await UserGenerate.createExample();
        await tournament.addPlayer(user);

        return reply.send({
            message: `User ${user.username} joined tournament ${tournament.name}`,
            tournament: await tournament.toDTO().withGames(),
        });
    }

    @GET("/start/:id")
    async startTournament(request: FastifyRequest, reply: FastifyReply) {
        const tournamentId = Number((request.params as { id: string }).id);
        const tournament = await Tournament.findByPk(tournamentId);
        if (!tournament) throw new HttpException(404, "Tournament not found");

        if (tournament.status === GameStatus.WAITING) {
            tournament.status = GameStatus.IN_PROGRESS;
        }

        const round = await tournament.startRound();
        await tournamentExampleRoundFlow(tournament);
        return reply.send({
            message: `Round started for tournament ${tournament.name}`,
            games: round,
        });
    }
}
