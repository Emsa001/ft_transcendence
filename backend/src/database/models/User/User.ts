import {
    BelongsToManyGetAssociationsMixin,
    InferAttributes,
    InferCreationAttributes,
} from 'sequelize';
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
} from 'sequelize-typescript';
import { UserDTO } from './UserDTO';
import { Game } from '../Game/Game';
import { GameUsers } from '../Game/GameUsers';

type CreationAttributes = InferCreationAttributes<
    User,
    { omit: 'id' | 'games' | 'twoFASecret' | 'is2FAEnabled' }
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

    @Default('email')
    @Column(DataType.STRING)
    declare provider: 'google' | 'email';

    @BelongsToMany(() => Game, () => GameUsers)
    declare games: Game[];

    // Methods

    toDTO(): UserDTO {
        return new UserDTO(this);
    }

    static async findByEmail(email: string): Promise<User | null> {
        return this.findOne({ where: { email } });
    }

    declare getGames: BelongsToManyGetAssociationsMixin<Game>;
}
