import { startClean } from "@/database/client";
import { Game } from "@/database/models/Game/Game";
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

    it("should set user as deleted when has games", async () => {
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
