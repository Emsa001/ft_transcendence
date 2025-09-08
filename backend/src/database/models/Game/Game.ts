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
    Unique,
    BeforeCreate,
} from "sequelize-typescript";
import { User } from "../User/User";
import { GameUser } from "./GameUser";
import { GameDTO } from "./GameDTO";
import {
    GameCreationAttributes,
    GameMode,
    GameStatus,
    GameUserDTOType,
} from "shared";
import { HttpException } from "@/utils/exceptions";
import { Tournament } from "../Tournaments/Tournament";
import { GameHooks } from "./GameHooks";
import { GameService } from "./GameService";

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
    // Identifiers
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @ForeignKey(() => User)
    @AllowNull(true)
    @Default(null) // game with no host
    @Column(DataType.INTEGER)
    declare hostId: number | null;

    @Unique
    @AllowNull(true)
    @Column(DataType.STRING)
    declare code?: string;

    // Core metadata
    @Default(GameStatus.WAITING)
    @Column(DataType.STRING)
    declare status: GameStatus;

    @Default(GameMode.NORMAL)
    @Column(DataType.STRING)
    declare mode: GameMode;

    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    declare isPrivate: boolean;

    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    declare randomEvents: boolean;

    // Gameplay settings
    @AllowNull(false)
    @Default(2)
    @Column(DataType.INTEGER)
    declare maxPlayers: number;

    @AllowNull(false)
    @Default(11)
    @Column(DataType.INTEGER)
    declare maxScore: number;

    @AllowNull(true)
    @Column(DataType.INTEGER)
    declare round?: number;

    @ForeignKey(() => Tournament)
    @Column(DataType.INTEGER)
    declare tournamentId?: number;

    // Relations
    @BelongsToMany(() => User, () => GameUser)
    declare players: UserWithGameData[];

    @ForeignKey(() => GameUser)
    @AllowNull(true)
    @Default(null)
    @Column(DataType.INTEGER)
    declare winnerId?: number;

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

    end = async () => GameService.end(this);

    getGameUsers(): GameUserDTOType[] {
        if (!this.players)
            throw new HttpException(500, "Players not loaded in Game instance");

        return this.players
            .map((p) => ({
                ...p.toDTO(),
                score: p.GameUser.score,
            }))
            .sort((a, b) => a.id - b.id);
    }

    static findByCode = (code: string) => Game.findOne({ where: { code } });

    async playerScore(userId: number, score: number) {
        if (this.status !== GameStatus.IN_PROGRESS)
            throw new HttpException(400, "Game is not in progress");

        await GameUser.increment(
            { score },
            {
                where: { userId, gameId: this.id },
            }
        );
    }

    @BeforeCreate
    static async generateGameCode(instance: Game) {
        await GameHooks.generateGameCode(instance);
    }
}
