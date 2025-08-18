import { startClean } from "@/database/client";
import { Sequelize } from "sequelize";
import { Game } from "@/database/models/Game/Game";
import { UserGenerate } from "@/database/models/User/UserGenerate";
import { GameStatus } from "shared";
import { Tournament } from "@/database/models/Tournaments/Tournament";
import { TournamentUser } from "@/database/models/Tournaments/TournamentUser";

describe("Tournament Tests", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = await startClean();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create and register users to a tournament", async () => {
        const tournament = await Tournament.create({ maxPlayers: 4 });
        const user1 = await UserGenerate.createExample();
        const user2 = await UserGenerate.createExample();

        await tournament.addPlayers([user1, user2]);

        const participants = await tournament.getPlayers();

        expect(participants.length).toBe(2);
        expect(participants.map((p) => p.id)).toContain(user1.id);
        expect(participants.map((p) => p.id)).toContain(user2.id);
    });

    it("should create all games for single elimination tournament", async () => {
        const tournament = await Tournament.create({ maxPlayers: 4 });
        const user1 = await UserGenerate.createExample();
        const user2 = await UserGenerate.createExample();

        await tournament.addPlayers([user1, user2]);

        const games = await tournament.createAllGames();
        // Single elimination with 4 players needs 3 games total (4-1=3)
        expect(games.length).toBe(3);
    });

    it("should create correct number of games for different tournament sizes", async () => {
        // Test 8-player tournament
        const tournament8 = await Tournament.create({ maxPlayers: 8 });
        const games8 = await tournament8.createAllGames();
        expect(games8.length).toBe(7); // 8-1=7 games total

        // Test 16-player tournament
        const tournament16 = await Tournament.create({ maxPlayers: 16 });
        const games16 = await tournament16.createAllGames();
        expect(games16.length).toBe(15); // 16-1=15 games total

        // Test 2-player tournament (simplest case)
        const tournament2 = await Tournament.create({ maxPlayers: 2 });
        const games2 = await tournament2.createAllGames();
        expect(games2.length).toBe(1); // 2-1=1 game total
    });
});
