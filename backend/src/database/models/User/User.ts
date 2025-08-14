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

	@BelongsToMany(() => User, () => UserFriends, 'userId1', 'userId2')
    declare friends: User[];

    toDTO(): UserDTO {
        return new UserDTO(this);
    }

    static async findByEmail(email: string): Promise<User | null> {
        return this.findOne({ where: { email } });
    }

	async getFriends(): Promise<User[]> {
		const allFriends = await UserFriends.findAll({
			where: {
				[Op.or]: [
					{ userId1: this.id },
					{ userId2: this.id }
				]
			}
		});

		const friendIds = allFriends.map(allFriends => {
			return allFriends.userId1 === this.id ? allFriends.userId2 : allFriends.userId1;
		});

		return User.findAll({
			where: {
				id: friendIds
			}
		});
	}

	async addFriend(friend: User): Promise<UserFriends> {
		return UserFriends.create({
			userId1: this.id,
			userId2: friend.id,
			accepted: true
		});
	}

    declare getGames: BelongsToManyGetAssociationsMixin<Game>;
	declare removeFriend: BelongsToManyRemoveAssociationMixin<User, number>;
}
