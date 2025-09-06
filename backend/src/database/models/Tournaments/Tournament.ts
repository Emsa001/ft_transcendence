import {
    BelongsToManyAddAssociationMixin,
    BelongsToManyAddAssociationsMixin,
    BelongsToManyGetAssociationsMixin,
    BelongsToManySetAssociationsMixin,
    BelongsToManyRemoveAssociationMixin,
    BelongsToManyRemoveAssociationsMixin,
    BelongsToManyHasAssociationMixin,
    BelongsToManyHasAssociationsMixin,
    BelongsToManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    HasManyGetAssociationsMixin,
    InferAttributes,
} from "sequelize";
import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    HasMany,
    BelongsToMany,
    Default,
    BeforeCreate,
    Scopes,
    ForeignKey,
    AllowNull,
} from "sequelize-typescript";
import { User } from "../User/User";
import { TournamentUser } from "./TournamentUser";
import { Game } from "../Game/Game";
import { GameStatus, TournamentCreateType } from "shared";
import { TournamentHooks } from "./TournamentHooks";
import { TournamentDTO } from "./TournamentDTO";
import { TournamentCreationService } from "@/modules/tournament/services/create.service";
import { TournamentGamePlayService } from "@/modules/tournament/services/gameplay.service";

type UserWithTournamentData = User & {
    TournamentUser: TournamentUser;
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
export class Tournament extends Model<
    InferAttributes<Tournament>,
    TournamentCreateType
> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column(DataType.STRING)
    declare name: string;

    @AllowNull(false)
    @Default(() => crypto.randomUUID())
    @Column(DataType.STRING)
    declare uuid: string;

    @ForeignKey(() => User)
    @AllowNull(true)
    @Default(null) // game with no host
    @Column(DataType.INTEGER)
    declare hostId: number | null;

    @Default(GameStatus.WAITING)
    @Column(DataType.STRING)
    declare status: GameStatus;

    @Default(3)
    @Column(DataType.INTEGER)
    declare maxScore: number;

    @HasMany(() => Game)
    declare games: Game[];

    @BelongsToMany(() => User, () => TournamentUser)
    declare players: UserWithTournamentData[];

    @Default(0)
    @Column(DataType.INTEGER)
    declare round: number;

    @Default(16)
    @Column(DataType.INTEGER)
    declare maxPlayers: number;

    @ForeignKey(() => TournamentUser)
    @AllowNull(true)
    @Default(null)
    @Column(DataType.INTEGER)
    declare winnerId?: number;

    // Magic association methods
    declare addPlayer: BelongsToManyAddAssociationMixin<User, number>;
    declare addPlayers: BelongsToManyAddAssociationsMixin<User, number>;
    declare getPlayers: BelongsToManyGetAssociationsMixin<UserWithTournamentData>;
    declare setPlayers: BelongsToManySetAssociationsMixin<User, number>;
    declare removePlayer: BelongsToManyRemoveAssociationMixin<User, number>;
    declare removePlayers: BelongsToManyRemoveAssociationsMixin<User, number>;
    declare hasPlayer: BelongsToManyHasAssociationMixin<User, number>;
    declare hasPlayers: BelongsToManyHasAssociationsMixin<User, number>;
    declare countPlayers: BelongsToManyCountAssociationsMixin;
    declare createGame: HasManyCreateAssociationMixin<Game>;
    declare getGames: HasManyGetAssociationsMixin<Game>;

    getActivePlayers = async (): Promise<UserWithTournamentData[]> => {
        const allPlayers = await this.getPlayers();
        return allPlayers.filter((player) => !player.TournamentUser.eliminated);
    };

    static findByUUID = async (uuid: string): Promise<Tournament | null> =>
        Tournament.findOne({ where: { uuid } });

    start = async () => TournamentCreationService.start(this);
    end = async () => TournamentCreationService.end(this);
    createGames = async () => TournamentCreationService.createGames(this);
    startRound = async () => TournamentCreationService.startRound(this);
    eliminatePlayer = async (playerId: number) =>
        TournamentGamePlayService.eliminatePlayer(this, playerId);
    exampleRoundFlow = async (winner?: number) =>
        TournamentGamePlayService.exampleRoundFlow(this, winner);

    toDTO() {
        return new TournamentDTO(this);
    }

    @BeforeCreate
    static async beforeCreateTournament(tournament: Tournament): Promise<void> {
        await TournamentHooks.beforeCreateTournament(tournament);
    }
}
