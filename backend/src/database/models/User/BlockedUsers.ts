import { InferAttributes, InferCreationAttributes } from "sequelize";
import {
    Table,
    Column,
    Model,
    DataType,
    Default,
    AutoIncrement,
    PrimaryKey,
    ForeignKey,
} from "sequelize-typescript";

import { User } from "./User";

@Table
export class BlockedUsers extends Model<
    InferAttributes<BlockedUsers>,
    InferCreationAttributes<BlockedUsers, { omit: "id" }>
> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    declare userId: number;

    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    declare blockedUserId: number;
}
