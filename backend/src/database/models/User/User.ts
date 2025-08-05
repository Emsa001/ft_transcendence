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
import { UserDTO } from './UserDTO';

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

    @Default("local")
    @Column(DataType.STRING)
    declare provider: "google" | "email";

    toDTO(): UserDTO {
        return new UserDTO(this);
    }
}
