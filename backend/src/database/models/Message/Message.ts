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
import { MessageDTOType } from "shared";

@Table
export class Message extends Model<
    InferAttributes<Message>,
    InferCreationAttributes<Message, { omit: 'id' }>
> implements MessageDTOType {
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

    @Column(DataType.DATE)
    declare createdAt: Date;
}