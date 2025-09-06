import {
    BelongsToManyCountAssociationsMixin,
    BelongsToManyGetAssociationsMixin,
    FindOptions,
    InferAttributes,
    Op,
} from "sequelize";
import {
    Table,
    Column,
    Model,
    DataType,
    AllowNull,
    Unique,
    Default,
    PrimaryKey,
    AutoIncrement,
    BelongsToMany,
    BeforeUpdate,
    BeforeCreate,
} from "sequelize-typescript";
import { UserDTO } from "./UserDTO";
import { Game } from "../Game/Game";
import { GameUser } from "../Game/GameUser";
import { Tournament } from "../Tournaments/Tournament";
import { TournamentUser } from "../Tournaments/TournamentUser";
import { HttpException } from "@/utils/exceptions";
import { UserFriends } from "./UserFriends";
import { FriendsService } from "@/modules/friends/services/user.friends";
import { UserGamesService } from "@/modules/user/services/user.games";
import { chatDBService } from "@/modules/chat/service/db.service";
import { BlockedUsers } from "./BlockedUsers";
import { BlockUserService } from "@/modules/user/services/user.block";

type CreationAttributes = {
    email?: string | null;
    username: string;
    password?: string | null;
    avatar?: string | null;
    provider?: "google" | "local";
    status?: "active" | "deleted";
};

@Table
export class User extends Model<InferAttributes<User>, CreationAttributes> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Unique
    @AllowNull(true)
    @Default(null)
    @Column(DataType.STRING)
    declare email: string | null;

    @Unique
    @AllowNull(false)
    @Column({
        type: DataType.STRING,
        validate: { len: [2, 32] },
    })
    declare username: string;

    @Unique
    @AllowNull(true)
    @Column(DataType.STRING)
    declare slug: string | null;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.STRING)
    declare password: string | null;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.STRING)
    declare avatar: string | null;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.STRING)
    declare twoFASecret: string | null;

    @Default(false)
    @Column(DataType.BOOLEAN)
    declare is2FAEnabled: boolean;

    @Default("local")
    @Column(DataType.STRING)
    declare provider: CreationAttributes["provider"];

    @Default("active")
    @Column(DataType.STRING)
    declare status: "active" | "deleted";

    @BelongsToMany(() => Game, () => GameUser)
    declare games: Game[];

    @BelongsToMany(() => Tournament, () => TournamentUser)
    declare tournaments: Tournament[];

    // Magic Methods
    declare getGames: BelongsToManyGetAssociationsMixin<Game>;
    declare getGamesCount: BelongsToManyCountAssociationsMixin;
    declare getTournaments: BelongsToManyGetAssociationsMixin<Tournament>;
    declare getTournamentsCount: BelongsToManyCountAssociationsMixin;

    // Custom  Methods

    toDTO(): UserDTO {
        return new UserDTO(this);
    }

    static findByEmail = (email: string, options?: FindOptions) => {
        const where = { email, ...(options?.where ?? {}) };
        return User.findOne({ ...options, where });
    };

    static findByUsername = async (username: string, options?: FindOptions) => {
        const where = {
            slug: username.toLowerCase(),
            ...(options?.where ?? {}),
        };
        const user = await User.findOne({ ...options, where });
        return user;
    };

    static findById = async (id: number | string | undefined) => {
        if (typeof id === "undefined")
            throw new HttpException(400, "User ID is required");

        if (typeof id === "string" && Number.isNaN(Number(id)))
            throw new HttpException(400, "Invalid user ID");

        const user = await User.findByPk(id);
        if (!user) throw new HttpException(404, "User not found");

        return user;
    };

    getStatistics = async () => UserGamesService.getStatistics(this);

    findChat = async (userId: number, options: FindOptions) =>
        chatDBService.findChat(this.id, userId, options);

    // friends
    @BelongsToMany(() => User, () => UserFriends, "userId1", "userId2")
    declare friends: User[];

    getFriends = async () => FriendsService.getFriends(this.id);

    askFriendRequest = async (friendId: number) =>
        FriendsService.askFriendRequest(this.id, friendId);

    acceptFriendRequest = async (friendId: number) =>
        FriendsService.acceptFriendRequest(friendId, this.id);

    removeFriend = async (friendId: number) =>
        FriendsService.removeFriend(this.id, friendId);

    getFriendRequests = async () => FriendsService.getFriendRequests(this.id);
    getAllSentRequests = async () => FriendsService.getAllSentRequests(this.id);

    // block user
    @BelongsToMany(() => User, () => BlockedUsers, "userId", "blockedUserId")
    declare blockedUsers: User[];

    getBlockedUsers = async () => BlockUserService.getBlockedUsers(this);
    blockUser = async (userId: number) =>
        BlockUserService.blockUser(this, userId);
    unblockUser = async (userId: number) =>
        BlockUserService.unblockUser(this, userId);
    isBlocked = async (userId: number) =>
        BlockUserService.isBlocked(this.id, userId);

    // TODO: check for other uses of username and change to slug

    @BeforeCreate
    static async createSlug(instance: User) {
        if (instance.changed("username")) {
            instance.slug = instance.username.toLowerCase();
        }
    }

    @BeforeUpdate
    static async updateSlug(instance: User) {
        if (instance.changed("username")) {
            instance.slug = instance.username.toLowerCase();

            const existingUser = await User.findOne({
                where: {
                    slug: instance.slug,
                    id: { [Op.ne]: instance.id },
                },
            });

            if (existingUser) {
                throw new HttpException(400, "Username already exists");
            }
        }
    }
}
