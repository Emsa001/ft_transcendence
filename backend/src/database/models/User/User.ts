import {
    BelongsToManyGetAssociationsMixin,
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
import { GameUsers } from "../Game/GameUsers";
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
    @AllowNull(false)
    @Column(DataType.STRING)
    declare email: string;

    @AllowNull(true)
    @Default(null)
    @Column({
        type: DataType.STRING,
        validate: { len: [3, 100] },
    })
    declare name: string | null;

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
    @AllowNull(true)
    @Column(DataType.BOOLEAN)
    declare is2FAEnabled: boolean;

    @Default("email")
    @Column(DataType.STRING)
    declare provider: "google" | "email";

    @BelongsToMany(() => Game, () => GameUsers)
    declare games: Game[];

    declare getGames: BelongsToManyGetAssociationsMixin<Game>;

    @BelongsToMany(() => User, () => UserFriends, "userId1", "userId2")
    declare friends: User[];

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

    static findByEmail = (email: string) => User.findOne({ where: { email } });
}
