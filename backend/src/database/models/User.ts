import {
    Table,
    Column,
    Model,
    DataType,
    AllowNull,
    Unique,
    Default,
} from 'sequelize-typescript';

class UserMethods extends Model {
    static getByEmail(email: string): Promise<User | null> {
        return User.findOne({
            where: { email },
            attributes: [
                'id',
                'username',
                'email',
                'picture',
                'twoFASecret',
                'is2FAEnabled',
            ],
            plain: true,
        });
    }

    static getPublicByEmail(email: string): Promise<User | null> {
        return User.findOne({
            where: { email },
            attributes: ['id', 'username', 'email', 'picture', 'is2FAEnabled'],
            plain: true,
        });
    }
}

@Table
export class User extends Model<User> {
    @Unique
    @AllowNull(false)
    @Column(DataType.STRING)
    email!: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING,
        validate: { len: [3, 30] },
    })
    username!: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    picture?: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    twoFASecret?: string;

    @Default(false)
    @Column(DataType.BOOLEAN)
    is2FAEnabled!: boolean;

    static getByEmail = UserMethods.getByEmail;
    static getPublicByEmail = UserMethods.getPublicByEmail;
}
