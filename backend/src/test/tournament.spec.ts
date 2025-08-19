import { startClean } from "@/database/client";
import { Op, Sequelize } from "sequelize";
import { UserGenerate } from "@/database/models/User/UserGenerate";
import { Tournament } from "@/database/models/Tournaments/Tournament";
import { tournamentExampleRoundFlow } from "@/modules/tournament/services/tournament.flow";
import { GameStatus } from "shared";

describe("Tournament Tests", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = await startClean();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create and register users", async () => {
        const tournament = await Tournament.create({ maxPlayers: 4 });
        const user1 = await UserGenerate.createExample();
        const user2 = await UserGenerate.createExample();

        await tournament.addPlayers([user1, user2]);

        const participants = await tournament.getPlayers();

        expect(participants.length).toBe(2);
        expect(participants.map((p) => p.id)).toContain(user1.id);
        expect(participants.map((p) => p.id)).toContain(user2.id);
    });

    it("should create games and assign players for each round", async () => {
        const tournament = await Tournament.create({ maxPlayers: 10 });
        for (let i = 0; i < 10; i++) {
            const user = await UserGenerate.createExample();
            await tournament.addPlayer(user);
        }

        tournament.status = GameStatus.IN_PROGRESS;

        // round 1: 2 games
        // round 2: 4 games
        // round 3: 2 games
        // final: 1 game

        // Round 1
        const round1 = await tournament.startRound();
        expect(round1.length).toBe(2);
        await tournamentExampleRoundFlow(tournament);

        // Round 2
        const round2 = await tournament.startRound();
        expect(round2.length).toBe(4);
        await tournamentExampleRoundFlow(tournament);

        // Round 3
        const round3 = await tournament.startRound();
        expect(round3.length).toBe(2);
        await tournamentExampleRoundFlow(tournament);

        // Final
        const final = await tournament.startRound();
        expect(final.length).toBe(1);
        await tournamentExampleRoundFlow(tournament);
    });

    it("should declare winner and all eliminated players", async () => {
        const tournament = await Tournament.create({ maxPlayers: 8 });
        for (let i = 0; i < 8; i++) {
            const user = await UserGenerate.createExample();
            await tournament.addPlayer(user);
        }

        tournament.status = GameStatus.IN_PROGRESS;

        while (tournament.status === GameStatus.IN_PROGRESS) {
            await tournament.startRound();
            await tournamentExampleRoundFlow(tournament);
        }

        const winner = tournament.winnerId;
        const playedGames = await tournament.getGames({
            include: [
                {
                    association: "players",
                    where: { id: winner },
                },
            ],
        });

        const eliminatedPlayers = (await tournament.getPlayers()).filter(
            (player) => player.TournamentUser.eliminated
        );

        expect(eliminatedPlayers.length).toBe(7);
        expect(winner).toBeDefined();
        expect(playedGames.length).toBe(3);
        expect(tournament.status).toBe(GameStatus.FINISHED);
    });

    it("should handle tournament with insufficient players", async () => {
        const tournament = await Tournament.create({ maxPlayers: 2 });
        const user1 = await UserGenerate.createExample();
        await tournament.addPlayer(user1);

        await expect(tournament.start()).rejects.toThrow(
            "Not enough players to start a tournament"
        );

        const players = await tournament.getPlayers();
        expect(players.length).toBe(1);
    });

    it("should handle tournament with too many players", async () => {
        const tournament = await Tournament.create({ maxPlayers: 4 });
        for (let i = 0; i < 4; i++) {
            const user = await UserGenerate.createExample();
            await tournament.addPlayer(user);
        }

        const user5 = await UserGenerate.createExample();
        await expect(tournament.addPlayer(user5)).rejects.toThrow(
            "Maximum number of players reached"
        );

        const players = await tournament.getPlayers();
        expect(players.length).toBe(4);
    });

    it("should handle a lot of players in a tournament", async () => {
        const tournament = await Tournament.create({ maxPlayers: 64 });
        for (let i = 0; i < 64; i++) {
            const user = await UserGenerate.createExample();
            await tournament.addPlayer(user);
        }

        const players = await tournament.getPlayers();

        expect(players.length).toBe(64);
        expect(tournament.status).toBe(GameStatus.WAITING);

        await tournament.start();
        expect(tournament.status).toBe(GameStatus.IN_PROGRESS);

        while (tournament.status === GameStatus.IN_PROGRESS) {
            await tournament.startRound();
            await tournamentExampleRoundFlow(tournament);
        }

        expect(tournament.round).toBe(6);
        expect(tournament.status).toBe(GameStatus.FINISHED);
        expect(tournament.winnerId).toBeDefined();
    });
});
