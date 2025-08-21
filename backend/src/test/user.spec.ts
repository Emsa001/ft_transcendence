import { startClean } from "@/database/client";
import { Game } from "@/database/models/Game/Game";
import { User } from "@/database/models/User/User";
import { UserGenerate } from "@/database/models/User/UserGenerate";
import userAccountService from "@/modules/user/services/user.account";
import { UserGamesService } from "@/modules/user/services/user.games";
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
        await userAccountService.deleteAccount(user.id);

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

        await userAccountService.deleteAccount(user1.id);

        const players = await game.getPlayers();
        expect(players).toHaveLength(2);
    });

    it("should add and remove friend", async () => {
        const user1 = await UserGenerate.createExample();
        const user2 = await UserGenerate.createExample();

        await user1.askFriendRequest(user2.id);

        const friendRequests = await user2.getFriendRequests();
        expect(friendRequests).toContainEqual(
            expect.objectContaining({ id: user1.id })
        );

        await user2.acceptFriendRequest(user1.id);
        expect(await user1.getFriends()).toContainEqual(
            expect.objectContaining({ id: user2.id })
        );

        await user2.removeFriend(user1.id);
        expect(await user2.getFriends()).toHaveLength(0);
    });

    it("error handling in friends", async () => {
        const user1 = await UserGenerate.createExample();
        const user2 = await UserGenerate.createExample();

        await expect(user1.askFriendRequest(user1.id)).rejects.toThrow(
            "Cannot send friend request to yourself"
        );

        await expect(user1.askFriendRequest(-1)).rejects.toThrow(
            "User not found"
        );

        await user1.askFriendRequest(user2.id);
        await user2.acceptFriendRequest(user1.id);

        await expect(user1.askFriendRequest(user2.id)).rejects.toThrow(
            "You are already friends"
        );

        await user1.removeFriend(user2.id);
        await expect(user1.removeFriend(user2.id)).rejects.toThrow(
            "You are not friends"
        );
    });
});
