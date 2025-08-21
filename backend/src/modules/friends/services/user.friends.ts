import { User } from "@/database/models/User/User";
import { UserFriends } from "@/database/models/User/UserFriends";
import { Op } from "sequelize";

class FriendsService {
    async askFriendRequest(userId1: number, userId2: number) {
        const friendship = await UserFriends.create({ userId1, userId2 });
        return friendship;
    }

    async acceptFriendRequest(userId1: number, userId2: number) {
        const friendship = await UserFriends.findOne({
            where: { userId1, userId2 },
        });

        if (friendship) {
            friendship.accepted = true;
            await friendship.save();
        }
    }

    async removeFriend(id1: number, id2: number) {
        const friendship = await UserFriends.findOne({
            where: {
                [Op.or]: [
                    { userId1: id1, userId2: id2 },
                    { userId1: id2, userId2: id1 },
                ],
            },
        });
        if (friendship) {
            await friendship.destroy();
        }
    }

    async getFriends(id: number) {
        try {
            const friendships = await UserFriends.findAll({
                where: {
                    accepted: true,
                    [Op.or]: [{ userId1: id }, { userId2: id }],
                },
            });
            const friendIds = friendships.map((f) =>
                f.userId1 === id ? f.userId2 : f.userId1
            );

            return User.findAll({
                where: { id: friendIds },
            });
        } catch (error) {
            return [];
        }
    }

    async getFriendRequests(id: number) {
        try {
            const friendRequests = await UserFriends.findAll({
                where: {
                    accepted: false,
                    userId2: id,
                },
            });

            const requesterIds = friendRequests.map((f) => f.userId1);
            return User.findAll({
                where: { id: requesterIds },
            });
        } catch (error) {
            return [];
        }
    }

    async getAllSentRequests(id: number) {
        try {
            const sentRequests = await UserFriends.findAll({
                where: {
                    accepted: false,
                    userId1: id,
                },
            });

            const recipientIds = sentRequests.map((f) => f.userId2);
            return User.findAll({
                where: { id: recipientIds },
            });
        } catch (error) {
            return [];
        }
    }
}

const friendsService = new FriendsService();
export default friendsService;
