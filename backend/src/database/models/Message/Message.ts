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

import { User } from "../User/User";

@Table
export class Message extends Model<
    InferAttributes<Message>,
    InferCreationAttributes<Message, { omit: "id" }>
> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    declare sender: number;

    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    declare receiver: number;

    @Column(DataType.TEXT)
    declare message: string;
}
