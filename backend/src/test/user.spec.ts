import { startClean } from "@/database/client";
import { Game } from "@/database/models/Game/Game";
import { Tournament } from "@/database/models/Tournaments/Tournament";
import { User } from "@/database/models/User/User";
import { UserGenerate } from "@/database/models/User/UserGenerate";
import userAccountService from "@/modules/user/services/user.account";
import { Sequelize } from "sequelize";
import { GameStatus } from "shared";

describe("User Tests", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = await startClean();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should set user as deleted", async () => {
        const user = await UserGenerate.createExample();
        await userAccountService.deleteAccount(user);

        const deletedUser = await User.findByPk(user.id);
        expect(deletedUser!.status).toBe("deleted");
        expect(deletedUser!.password).toBeNull();
        expect(deletedUser!.username).toMatch(/deleted_user_\d+/);
    });

    it("should set user with game history as deleted", async () => {
        const game = await Game.create({
            status: GameStatus.WAITING,
            maxPlayers: 2,
        });
        const user1 = await UserGenerate.createExample();
        const user2 = await UserGenerate.createExample();

        await game.addPlayers([user1, user2]);

        game.status = GameStatus.IN_PROGRESS;
        await game.playerScore(user1.id, 10);
        await game.playerScore(user2.id, 20);
        game.status = GameStatus.FINISHED;
        await game.save();

        await userAccountService.deleteAccount(user1);

        const players = await game.getPlayers();
        expect(players).toHaveLength(2);
    });
});

describe("User Statistics Tests", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = await startClean();
    });
    afterEach(async () => {
        await sequelize.close();
    });

    it("should calculate game statistics correctly", async () => {
        const user1 = await UserGenerate.createExample();
        const user2 = await UserGenerate.createExample();

        for (let i = 0; i < 3; i++) {
            await winGame(user1);
            await loseGame(user2);
        }

        for (let i = 0; i < 2; i++) {
            await loseGame(user1);
            await winGame(user2);
        }

        const stats1 = await user1.getStatistics();
        expect(stats1.casual.amount).toBe(5);
        expect(stats1.casual.wins).toBe(3);
        expect(stats1.casual.losses).toBe(2);
        expect(stats1.casual.winRate).toBe(60.0);

        const stats2 = await user2.getStatistics();
        expect(stats2.casual.amount).toBe(5);
        expect(stats2.casual.wins).toBe(2);
        expect(stats2.casual.losses).toBe(3);
        expect(stats2.casual.winRate).toBe(40.0);
    });

    it("should calculate tournament statistics correctly", async () => {
        const user1 = await UserGenerate.createExample();
        const user2 = await UserGenerate.createExample();

        const tournament1 = await Tournament.create();

        await tournament1.addPlayers([user1, user2]);
        await tournament1.start();

        while (tournament1.status === GameStatus.IN_PROGRESS) {
            await tournament1.createRound();
            await tournament1.exampleRoundFlow(user1.id);
        }

        const stats1 = await user1.getStatistics();
        expect(stats1.tournaments.amount).toBe(1);
        expect(stats1.tournaments.wins).toBe(1);
        expect(stats1.tournaments.losses).toBe(0);
        expect(stats1.tournaments.winRate).toBe(100.0);

        expect(stats1.casual.amount).toBe(0);

        const stats2 = await user2.getStatistics();
        expect(stats2.tournaments.amount).toBe(1);
        expect(stats2.tournaments.wins).toBe(0);
        expect(stats2.tournaments.losses).toBe(1);
        expect(stats2.tournaments.winRate).toBe(0.0);

        expect(stats2.casual.amount).toBe(0);
    });

    it("should calculate total statistics correctly", async () => {
        const user1 = await UserGenerate.createExample();
        const user2 = await UserGenerate.createExample();

        for (let i = 0; i < 3; i++) {
            await winGame(user1);
            await loseGame(user2);
        }

        for (let i = 0; i < 2; i++) {
            await loseGame(user1);
            await winGame(user2);
        }

        const tournament1 = await Tournament.create();
        await tournament1.addPlayers([user1, user2]);
        await tournament1.start();

        while (tournament1.status === GameStatus.IN_PROGRESS) {
            await tournament1.createRound();
            await tournament1.exampleRoundFlow(user1.id);
        }

        const stats1 = await user1.getStatistics();
        expect(stats1.total.amount).toBe(6);
        expect(stats1.total.wins).toBe(4);
        expect(stats1.total.losses).toBe(2);

        const stats2 = await user2.getStatistics();
        expect(stats2.total.amount).toBe(6);
        expect(stats2.total.wins).toBe(2);
        expect(stats2.total.losses).toBe(4);
    });
});

// Helper functions to simulate game outcomes

const playGame = async (
    user: User,
    game: Game,
    userScore: number,
    opponentScore: number
) => {
    const opponent = await UserGenerate.createExample();
    await game.addPlayers([user, opponent]);
    game.status = GameStatus.IN_PROGRESS;
    await game.playerScore(user.id, userScore);
    await game.playerScore(opponent.id, opponentScore);
    game.status = GameStatus.FINISHED;
    await game.save();
};

const winGame = async (user: User, game?: Game) => {
    if (!game) game = await Game.create();
    await playGame(user, game, 10, 0);
};

const loseGame = async (user: User, game?: Game) => {
    if (!game) game = await Game.create();

    await playGame(user, game, 0, 10);
};
