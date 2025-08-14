import {
    BelongsToManyGetAssociationsMixin,
    BOOLEAN,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import {
    Table,
    Column,
    Model,
    DataType,
    AllowNull,
    Unique,
    Default,
    AutoIncrement,
    BelongsToMany,
	PrimaryKey,
	ForeignKey,
} from "sequelize-typescript";

import { UserDTO } from "./UserDTO";
import { User } from "./User";


@Table
export class UserFriends extends Model<InferAttributes<UserFriends>, InferCreationAttributes<UserFriends, { omit: "id" }>> {
	@PrimaryKey
	@AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

	@ForeignKey(() => User)
    @Column(DataType.INTEGER)
    declare userId1: number;

	@ForeignKey(() => User)
    @Column(DataType.INTEGER)
    declare userId2: number;

	@Default(false)
	@Column(DataType.BOOLEAN)
	declare accepted: boolean;
}




