import { User } from "@/database/models/User/User";
import { HttpException } from "@/utils/exceptions";
import { BlockedUsers } from "@/database/models/User/BlockedUsers";
import { Op } from "sequelize";

export class BlockUserService {
    static async isBlocked(id1: number, id2: number) {
        const blockedUser = await BlockedUsers.findOne({
            where: {
                [Op.or]: [
                    { userId: id1, blockedUserId: id2 },
                    { userId: id2, blockedUserId: id1 },
                ],
            },
        });
        if (blockedUser) {
            return true;
        }
        return false;
    }

    static async blockUser(user: User, userId: number) {
        if (await this.isBlocked(user.id, userId)) {
            throw new HttpException(400, "User is already blocked");
        }
        const blockedUser = await BlockedUsers.create({
            userId: user.id,
            blockedUserId: userId,
        });

        if (!blockedUser) {
            throw new HttpException(400, "Failed to block user");
        }

        user.removeFriend(userId);
        return { message: "User blocked successfully" };
    }
    static async unblockUser(user: User, userId: number) {
        const unblockedUser = await BlockedUsers.destroy({
            where: {
                userId: user.id,
                blockedUserId: userId,
            },
        });

        if (!unblockedUser) {
            throw new HttpException(400, "Failed to unblock user");
        }

        return { message: "User unblocked successfully" };
    }
    static async getBlockedUsers(user: User) {
        const blockedUsers = await BlockedUsers.findAll({
            where: {
                userId: user.id,
            },
        });

        const users = await Promise.all(
            blockedUsers.map(async (blockedUser) => {
                const user = await User.findById(blockedUser.blockedUserId);
                return user ? user.toDTO() : null;
            })
        );
        return users;
    }
}
