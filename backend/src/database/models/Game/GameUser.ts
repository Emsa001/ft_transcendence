import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BeforeCreate,
    BeforeBulkCreate,
    Default,
    BelongsTo,
    AfterDestroy,
    AfterBulkDestroy,
} from "sequelize-typescript";
import { Game } from "./Game";
import { User } from "../User/User";
import { GameUserHooks } from "./GameHooks";

@Table({
    indexes: [
        {
            unique: true,
            fields: ["userId", "gameId"],
        },
    ],
})
export class GameUser extends Model {
    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    declare userId: number;

    @ForeignKey(() => Game)
    @Column(DataType.INTEGER)
    declare gameId: number;

    @Default(0)
    @Column(DataType.INTEGER)
    declare score: number;

    // Associations
    @BelongsTo(() => User)
    declare user: User;

    @BelongsTo(() => Game)
    declare game: Game;

    // Hooks
    @BeforeCreate
    static async verifyAddPlayer(GameUser: GameUser) {
        await GameUserHooks.verifyAddPlayer(GameUser);
    }

    @BeforeBulkCreate
    static async verifyBulkAddPlayer(GameUser: GameUser[]) {
        await GameUserHooks.verifyBulkAddPlayer(GameUser);
    }

    @AfterBulkDestroy
    static async AfterBulkDestroy(options: any) {
        const { where } = options;
        if (where.gameId && where.userId) {
            const gameId = where.gameId;
            const userId = where.userId;
            await GameUserHooks.setGameHost(gameId, userId);
        }
    }
}
