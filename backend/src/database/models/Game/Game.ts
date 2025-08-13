import {
    InferAttributes,
    InferCreationAttributes,
    BelongsToManyAddAssociationMixin,
    BelongsToManyAddAssociationsMixin,
    BelongsToManyGetAssociationsMixin,
    BelongsToManySetAssociationsMixin,
    BelongsToManyRemoveAssociationMixin,
    BelongsToManyRemoveAssociationsMixin,
    BelongsToManyHasAssociationMixin,
    BelongsToManyHasAssociationsMixin,
    BelongsToManyCountAssociationsMixin,
} from 'sequelize';
import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    BelongsToMany,
    Default,
} from 'sequelize-typescript';
import { User } from '../User/User';
import { GameUsers } from './GameUsers';
import { GameDTO } from './GameDTO';

export type GameStatus = 'waiting' | 'in_progress' | 'finished';
export type GameMode = 'normal' | 'codebattle';

@Table
export class Game extends Model<
    InferAttributes<Game>,
    InferCreationAttributes<Game, { omit: 'id' }>
> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Default('waiting')
    @Column(DataType.STRING)
    declare status: GameStatus;

    @Default('normal')
    @Column(DataType.STRING)
    declare mode: GameMode;

    @BelongsToMany(() => User, () => GameUsers)
    declare players: User[];

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

    // methods
    toDTO(): GameDTO {
        return new GameDTO(this);
    }
}
