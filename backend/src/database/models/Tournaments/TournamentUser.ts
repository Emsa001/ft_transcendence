import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    Default,
    PrimaryKey,
    AutoIncrement,
    BeforeCreate,
    BeforeBulkCreate,
} from "sequelize-typescript";
import { User } from "../User/User";
import { Tournament } from "./Tournament";
import { TournamentUserHooks } from "./TournamentHooks";

@Table({
    indexes: [
        {
            unique: true,
            fields: ["userId", "tournamentId"],
        },
    ],
})
export class TournamentUser extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    declare userId: number;

    @ForeignKey(() => Tournament)
    @Column(DataType.INTEGER)
    declare tournamentId: number;

    @Default(false)
    @Column(DataType.BOOLEAN)
    declare eliminated: boolean;

    // Associations
    @BelongsTo(() => User)
    declare user: User;

    @BelongsTo(() => Tournament)
    declare tournament: Tournament;

    // Hooks
    @BeforeCreate
    static async verifyAddPlayer(TournamentUser: TournamentUser) {
        await TournamentUserHooks.verifyAddPlayer(TournamentUser);
    }

    @BeforeBulkCreate
    static async verifyBulkAddPlayer(TournamentUser: TournamentUser[]) {
        await TournamentUserHooks.verifyBulkAddPlayer(TournamentUser);
    }
}
