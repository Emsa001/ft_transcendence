import { InferAttributes, InferCreationAttributes } from 'sequelize';
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
} from 'sequelize-typescript';

@Table
export class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User, { omit: 'id' }>
> {
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
        validate: { len: [3, 30] },
    })
    declare username: string | null;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.STRING)
    declare picture: string | null;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.STRING)
    declare twoFASecret: string | null;

    @Default(false)
    @AllowNull(true)
    @Column(DataType.BOOLEAN)
    declare is2FAEnabled: boolean;

    static async getByEmail(email: string): Promise<User | null> {
        return User.findOne({
            where: { email },
            attributes: [
                'id',
                'username',
                'email',
                'picture',
                'twoFASecret',
                'is2FAEnabled',
            ],
        });
    }

    static async getPublicByEmail(email: string): Promise<User | null> {
        return User.findOne({
            where: { email },
            attributes: ['id', 'username', 'email', 'picture', 'is2FAEnabled'],
        });
    }
}
