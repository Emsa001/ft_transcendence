import {
    BelongsToManyCountAssociationsMixin,
    BelongsToManyGetAssociationsMixin,
    FindOptions,
    InferAttributes,
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

type CreationAttributes = {
    email?: string | null;
    username: string;
    password?: string | null;
    avatar?: string | null;
    provider?: "google" | "local";
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
    declare provider: CreationAttributes["provider"];

    @BelongsToMany(() => Game, () => GameUser)
    declare games: Game[];

    // Magic Methods
    declare getGames: BelongsToManyGetAssociationsMixin<Game>;
    declare getGamesCount: BelongsToManyCountAssociationsMixin;

    // Custom  Methods

    toDTO(): UserDTO {
        return new UserDTO(this);
    }

    static findByEmail = (email: string, options?: FindOptions) =>
        User.findOne({ where: { email }, ...options });
    static findByUsername = (username: string, options?: FindOptions) =>
        User.findOne({ where: { username }, ...options });
    static findById = async (id: number | string | undefined) => {
        if (typeof id === "undefined")
            throw new HttpException(400, "User ID is required");

        if (typeof id === "string" && Number.isNaN(Number(id)))
            throw new HttpException(400, "Invalid user ID");

        const user = await User.findByPk(id);
        if (!user) throw new HttpException(404, "User not found");

        return user;
    };
}
