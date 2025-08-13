import { InferAttributes, InferCreationAttributes } from "sequelize";
import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    ForeignKey,
} from "sequelize-typescript";
import { Game } from "./Game";
import { User } from "../User/User";

/**
 * Extra table that connects users to games.
 * Each user can have multiple games and each game can have multiple users.
 */

@Table({
    indexes: [
        {
            unique: true,
            fields: ["userId", "gameId"],
        },
    ],
})
export class GameUsers extends Model<
    InferAttributes<GameUsers>,
    InferCreationAttributes<GameUsers, { omit: "id" }>
> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    declare userId: number;

    @ForeignKey(() => Game)
    @Column(DataType.INTEGER)
    declare gameId: number;
}
