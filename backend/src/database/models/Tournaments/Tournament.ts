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
    HasManyAddAssociationMixin,
    HasManyCreateAssociationMixin,
    HasManyGetAssociationsMixin,
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
} from "sequelize-typescript";
import { User } from "../User/User";
import { TournamentUser } from "./TournamentUser";
import { Game } from "../Game/Game";
import { GameStatus } from "shared";
import { TournamentHooks } from "./TournamentHooks";
import { TournamentCreationService } from "@/modules/tournament/services/torunament.creation";

@Table
export class Tournament extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column(DataType.STRING)
    declare name: string;

    @Default(GameStatus.WAITING)
    @Column(DataType.STRING)
    declare status: GameStatus;

    @HasMany(() => Game)
    declare games: Game[];

    @BelongsToMany(() => User, () => TournamentUser)
    declare players: User[];

    @Default(16)
    @Column(DataType.INTEGER)
    declare maxPlayers: number;

    // Magic association methods
    declare addPlayer: BelongsToManyAddAssociationMixin<User, number>;
    declare addPlayers: BelongsToManyAddAssociationsMixin<User, number>;
    declare getPlayers: BelongsToManyGetAssociationsMixin<User>;
    declare setPlayers: BelongsToManySetAssociationsMixin<User, number>;
    declare removePlayer: BelongsToManyRemoveAssociationMixin<User, number>;
    declare removePlayers: BelongsToManyRemoveAssociationsMixin<User, number>;
    declare hasPlayer: BelongsToManyHasAssociationMixin<User, number>;
    declare hasPlayers: BelongsToManyHasAssociationsMixin<User, number>;
    declare countPlayers: BelongsToManyCountAssociationsMixin;
    declare createGame: HasManyCreateAssociationMixin<Game>;
    declare getGames: HasManyGetAssociationsMixin<Game>;

    @BeforeCreate
    static async beforeCreateTournament(tournament: Tournament): Promise<void> {
        await TournamentHooks.beforeCreateTournament(tournament);
    }

    createAllGames = async () => TournamentCreationService.createAllGames(this);
}
