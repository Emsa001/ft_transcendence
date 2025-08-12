import { InferAttributes, InferCreationAttributes } from 'sequelize';
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
import { GameUserService } from './GameUserService';

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
    declare users: User[];

    // methods
    toDTO(): GameDTO {
        return new GameDTO(this);
    }

    async addPlayer(user: User): Promise<void> {
        return GameUserService.addPlayer(this, user);
    }

    async removePlayer(user: User): Promise<void> {
        return GameUserService.removePlayer(this, user);
    }

    async getPlayers(): Promise<User[]> {
        return GameUserService.getPlayers(this);
    }

    async hasPlayer(user: User): Promise<boolean> {
        return GameUserService.hasPlayer(this, user);
    }

}
