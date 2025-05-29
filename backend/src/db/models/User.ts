// db/models/User.ts
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../client";

class User extends Model {
    declare id: number;
    declare email: string;
    declare username: string;
    declare picture: string;
    declare twoFASecret: string;
    declare is2FAEnabled: boolean;

    static async getByEmail(email: string): Promise<User | null> {
        const user = await User.findOne({
            where: { email },
            attributes: ["id", "username", "email", "picture", "twoFASecret", "is2FAEnabled"],
            plain: true,
        });

        return user || null;
    }

    static async getPublicByEmail(email: string): Promise<User | null> {
        const user = await User.findOne({
            where: { email },
            attributes: ["id", "username", "email", "picture", "is2FAEnabled"],
            plain: true,
        });

        return user || null;
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [3, 30],
            },
        },
        picture: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        twoFASecret: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        is2FAEnabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    { sequelize }
);

export { User };
