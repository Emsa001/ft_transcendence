import { User } from "@/database/models/User/User";
import { HttpException } from "@/utils/exceptions";
import { UserFriends } from "@/database/models/User/UserFriends";
import { Op } from "sequelize";
import { BlockUserService } from "@/modules/user/services/user.block";

export class FriendsService {
    static async getFriendship(id1: number, id2: number, acceptedOnly = true) {
        if ((await User.findByPk(id2)) === null) {
            throw new HttpException(404, "User not found");
        }
        const friendship = await UserFriends.findOne({
            where: {
                [Op.or]: [
                    { userId1: id1, userId2: id2 },
                    { userId1: id2, userId2: id1 },
                ],
                accepted: acceptedOnly,
            },
        });
        return friendship;
    }

    static async askFriendRequest(userId1: number, userId2: number) {
        if (userId1 == userId2) {
            throw new HttpException(
                400,
                "Cannot send friend request to yourself"
            );
        }

        if (await BlockUserService.isBlocked(userId1, userId2)) {
            throw new HttpException(
                403,
                "You cannot send friend requests to blocked users"
            );
        }

        if (await this.getFriendship(userId1, userId2, false)) {
            throw new HttpException(
                409,
                "You are already friends or have a pending request"
            );
        }

        const friendship = await UserFriends.create({ userId1, userId2 });
        return friendship;
    }

    static async acceptFriendRequest(userId1: number, userId2: number) {
        if (await this.getFriendship(userId1, userId2)) {
            throw new HttpException(409, "You are already friends");
        }

        const friendship = await UserFriends.findOne({
            where: { userId1, userId2 },
        });

        if (friendship) {
            friendship.accepted = true;
            await friendship.save();
        }
    }

    static async removeFriend(id1: number, id2: number) {
        if ((await User.findByPk(id2)) === null) {
            throw new HttpException(404, "User not found");
        }
        const friendship = await UserFriends.findOne({
            where: {
                [Op.or]: [
                    { userId1: id1, userId2: id2 },
                    { userId1: id2, userId2: id1 },
                ],
            },
        });
        if (!friendship) {
            throw new HttpException(404, "You are not friends");
        }
        await friendship.destroy();
    }

    static async getFriends(id: number) {
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

    static async getFriendRequests(id: number) {
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

    static async getAllSentRequests(id: number) {
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
