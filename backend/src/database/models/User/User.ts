import { BelongsToManyGetAssociationsMixin, InferAttributes } from "sequelize";
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

type CreationAttributes = {
    email: string;
    name: string | null;
    password?: string | null;
    avatar?: string | null;
    provider?: "google" | "email";
};

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

    @Column({
        type: DataType.STRING,
        validate: { len: [2, 100] },
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
    @Column(DataType.BOOLEAN)
    declare is2FAEnabled: boolean;

    @Default("email")
    @Column(DataType.STRING)
    declare provider: CreationAttributes["provider"];

    @BelongsToMany(() => Game, () => GameUser)
    declare games: Game[];

    // Magic Methods
    declare getGames: BelongsToManyGetAssociationsMixin<Game>;

    // Custom  Methods

    toDTO(): UserDTO {
        return new UserDTO(this);
    }

    static async findByEmail(email: string): Promise<User | null> {
        return this.findOne({ where: { email } });
    }
}
