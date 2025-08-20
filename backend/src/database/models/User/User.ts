import {
    BelongsToManyCountAssociationsMixin,
    BelongsToManyGetAssociationsMixin,
    FindOptions,
    BelongsToManyAddAssociationMixin,
    BelongsToManyRemoveAssociationMixin,
    InferAttributes,
    InferCreationAttributes,
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
} from "sequelize-typescript";
import { UserDTO } from "./UserDTO";
import { Game } from "../Game/Game";
import { GameUser } from "../Game/GameUser";
import { HttpException } from "@/utils/exceptions";
import { UserFriends } from "./UserFriends";

type CreationAttributes = InferCreationAttributes<
    User,
    { omit: "id" | "games" | "twoFASecret" | "is2FAEnabled" | "friends" }
>;

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
        validate: { len: [2, 100] },
    })
    declare username: string;

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
    //declare provider: CreationAttributes["provider"];

    @Default("active")
    @Column(DataType.STRING)
    declare status: "active" | "deleted";

    @BelongsToMany(() => Game, () => GameUser)
    declare games: Game[];

    // Magic Methods
    declare getGames: BelongsToManyGetAssociationsMixin<Game>;
    declare getGamesCount: BelongsToManyCountAssociationsMixin;

    @BelongsToMany(() => User, () => UserFriends, "userId1", "userId2")
    declare friends: User[];

    static findByEmail = (email: string, options?: FindOptions) => {
        const where = { email, ...(options?.where ?? {}) };
        return User.findOne({ ...options, where });
    };

    static findByUsername = (username: string, options?: FindOptions) => {
        const where = { username, ...(options?.where ?? {}) };
        return User.findOne({ ...options, where });
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

    // TODO: Move Methods to some UserRepository

    async getFriends(): Promise<User[]> {
        const friendships = await UserFriends.findAll({
            where: {
                [Op.or]: [{ userId1: this.id }, { userId2: this.id }],
                accepted: true,
            },
        });

        const friendIds = friendships.map((f) =>
            f.userId1 === this.id ? f.userId2 : f.userId1
        );

        return User.findAll({
            where: { id: friendIds },
        });
    }

    async addFriend(friend: User): Promise<void> {
        if (friend.id === this.id) {
            throw new Error("Cannot add yourself as a friend");
        }

        const found = await UserFriends.count({
            where: {
                [Op.or]: [
                    { userId1: this.id, userId2: friend.id },
                    { userId1: friend.id, userId2: this.id },
                ],
            },
        });

        if (found > 0) {
            throw new Error("Friendship already exists");
        }

        await UserFriends.create({
            userId1: this.id,
            userId2: friend.id,
        });
    }

    async acceptFriend(friend: User): Promise<void> {
        const friendship = await UserFriends.findOne({
            where: {
                [Op.or]: [{ userId1: friend.id, userId2: this.id }],
                accepted: false,
            },
        });

        if (!friendship) {
            throw new Error("No pending invitation found");
        }

        friendship.accepted = true;
        await friendship.save();
    }

    async removeFriend(friend: User): Promise<void> {
        await UserFriends.destroy({
            where: {
                [Op.or]: [
                    { userId1: this.id, userId2: friend.id },
                    { userId1: friend.id, userId2: this.id },
                ],
            },
        });
    }

    toDTO(): UserDTO {
        return new UserDTO(this);
    }
}
