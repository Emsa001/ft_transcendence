import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    ForeignKey,
    BeforeCreate,
    BeforeBulkCreate,
    Default,
} from "sequelize-typescript";
import { InferAttributes, InferCreationAttributes } from "sequelize";
import { GameValidators } from "./GameValidators";
import { Game } from "./Game";
import { User } from "../User/User";

@Table({
    indexes: [
        {
            unique: true,
            fields: ["userId", "gameId"],
        },
    ],
})
export class GameUser extends Model<
    InferAttributes<GameUser>,
    InferCreationAttributes<GameUser, { omit: "id" }>
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

    @Default(0)
    @Column(DataType.INTEGER)
    declare score: number;

    // Hooks
    @BeforeCreate
    static async verifyAddPlayer(gameUser: GameUser): Promise<void> {
        await GameValidators.validateGameState(gameUser.gameId, 1);
    }

    @BeforeBulkCreate
    static async verifyBulkAddPlayer(GameUser: GameUser[]): Promise<void> {
        const gameGroups: Record<number, number> = {};
        for (const gu of GameUser) {
            gameGroups[gu.gameId] = (gameGroups[gu.gameId] || 0) + 1;
        }

        for (const gameIdStr in gameGroups) {
            const gameId = parseInt(gameIdStr, 10);
            await GameValidators.validateGameState(gameId, gameGroups[gameId]);
        }
    }
}
