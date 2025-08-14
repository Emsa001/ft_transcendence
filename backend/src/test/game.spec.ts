import { startClean } from "@/database/client";
import { Game, GameStatus } from "@/database/models/Game/Game";
import { UserExample } from "@/database/models/User/UserExample";
import { Sequelize } from "sequelize";

describe("Game Tests", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = await startClean();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should add player to a game", async () => {
        const game = await Game.create();
        const user = await UserExample.create();

        await game.addPlayer(user);

        const players = await game.getPlayers();

        expect(players.length).toBe(1);
        expect(players[0].id).toBe(user.id);
        expect(await game.hasPlayer(user)).toBe(true);
    });

    it("should remove player from a game", async () => {
        const game = await Game.create();
        const user1 = await UserExample.create();
        const user2 = await UserExample.create();

        await game.addPlayers([user1, user2]);
        await game.removePlayer(user2);

        expect(await game.hasPlayer(user2)).toBe(false);
        expect((await game.getPlayers()).length).toBe(1);
    });

    it("should create a game with multiple players", async () => {
        const game = await Game.create();
        const user1 = await UserExample.create();
        const user2 = await UserExample.create();

        await game.addPlayer(user1);
        await game.addPlayer(user2);

        const players = await game.getPlayers();
        expect(players.length).toBe(2);
        expect(await game.hasPlayer(user1)).toBe(true);
        expect(await game.hasPlayer(user2)).toBe(true);
    });

    it("Should not add player to a game that is not waiting", async () => {
        const game = await Game.create({ status: GameStatus.IN_PROGRESS });
        const user1 = await UserExample.create();
        const user2 = await UserExample.create();
        const user3 = await UserExample.create();

        await expect(game.addPlayer(user1)).rejects.toThrow(
            "Cannot add players to a game that is not waiting"
        );
        await expect(game.addPlayers([user2, user3])).rejects.toThrow(
            "Cannot add players to a game that is not waiting"
        );
    });

    it("Should not add more players than maxPlayers", async () => {
        const game = await Game.create({ maxPlayers: 1 });
        const user1 = await UserExample.create();
        const user2 = await UserExample.create();

        await game.addPlayer(user1);
        await expect(game.addPlayer(user2)).rejects.toThrow(
            "Maximum number of players reached"
        );
    });

    it("Should correctly set the winner of a game when finished", async () => {
        const game = await Game.create({
            status: GameStatus.WAITING,
            maxPlayers: 4,
        });
        const user1 = await UserExample.create();
        const user2 = await UserExample.create();
        const user3 = await UserExample.create();
        const user4 = await UserExample.create();

        await game.addPlayers([user1, user2, user3, user4]);

        await game.playerScore(user1.id, 10);
        await game.playerScore(user2.id, 20);
        await game.playerScore(user3.id, 15);
        await game.playerScore(user4.id, 5);

        game.status = GameStatus.FINISHED;

        await game.save();

        expect(game.winnerId).toBe(user2.id);
    });
});
