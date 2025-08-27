import {
    InferAttributes,
    BelongsToManyAddAssociationMixin,
    BelongsToManyAddAssociationsMixin,
    BelongsToManyGetAssociationsMixin,
    BelongsToManySetAssociationsMixin,
    BelongsToManyRemoveAssociationMixin,
    BelongsToManyRemoveAssociationsMixin,
    BelongsToManyHasAssociationMixin,
    BelongsToManyHasAssociationsMixin,
    BelongsToManyCountAssociationsMixin,
    BelongsToGetAssociationMixin,
} from "sequelize";
import {
    Table,
    Column,
    DataType,
    PrimaryKey,
    AutoIncrement,
    BelongsToMany,
    Default,
    AllowNull,
    Scopes,
    Model,
    ForeignKey,
    AfterUpdate,
} from "sequelize-typescript";
import { User } from "../User/User";
import { GameUser } from "./GameUser";
import { GameDTO } from "./GameDTO";
import { GameMode, GameStatus } from "shared";
import { HttpException } from "@/utils/exceptions";
import { Tournament } from "../Tournaments/Tournament";
import { GameHooks } from "./GameHooks";

export type GameCreationAttributes = {
    status?: GameStatus;
    mode?: GameMode;
    maxPlayers?: number;
    tournamentId?: number;
    winnerId?: number | null;
};

type UserWithGameData = User & {
    GameUser: GameUser;
};

@Scopes(() => ({
    defaultScope: {
        include: [
            {
                model: User,
                as: "players",
            },
        ],
    },
}))
@Table
export class Game extends Model<InferAttributes<Game>, GameCreationAttributes> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Default(GameStatus.WAITING)
    @Column(DataType.STRING)
    declare status: GameStatus;

    @Default(GameMode.NORMAL)
    @Column(DataType.STRING)
    declare mode: GameMode;

    @Default(2)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare maxPlayers: number;

    @BelongsToMany(() => User, () => GameUser)
    declare players: UserWithGameData[];

    @ForeignKey(() => GameUser)
    @AllowNull(true)
    @Default(null)
    @Column(DataType.INTEGER)
    declare winnerId?: number;

    @ForeignKey(() => Tournament)
    @Column(DataType.INTEGER)
    declare tournamentId?: number;

    /*
        Sequelize automatically generates association methods, it's called magic methods:
        https://medium.com/@julianne.marik/sequelize-associations-magic-methods-c72008db91c9
        https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
    */
    declare addPlayer: BelongsToManyAddAssociationMixin<User, number>;
    declare addPlayers: BelongsToManyAddAssociationsMixin<User, number>;
    declare getPlayers: BelongsToManyGetAssociationsMixin<User>;
    declare setPlayers: BelongsToManySetAssociationsMixin<User, number>;
    declare removePlayer: BelongsToManyRemoveAssociationMixin<User, number>;
    declare removePlayers: BelongsToManyRemoveAssociationsMixin<User, number>;
    declare hasPlayer: BelongsToManyHasAssociationMixin<User, number>;
    declare hasPlayers: BelongsToManyHasAssociationsMixin<User, number>;
    declare countPlayers: BelongsToManyCountAssociationsMixin;

    // Custom methods

    toDTO(): GameDTO {
        return new GameDTO(this);
    }

    playerScore = async (userId: number, score: number) => {
        if (this.status !== GameStatus.IN_PROGRESS)
            throw new HttpException(400, "Game is not in progress");
        await GameUser.increment(
            { score },
            {
                where: { userId, gameId: this.id },
            }
        );
    };

    // hooks

    @AfterUpdate
    static async setGameWinner(instance: Game) {
        await GameHooks.setGameWinner(instance);
    }
}
