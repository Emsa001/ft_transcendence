import { FastifyInstance } from "fastify";
import { Sequelize } from "sequelize-typescript";
import { User } from "./models/User/User";
import { Game } from "./models/Game/Game";
import { GameUser } from "./models/Game/GameUser";

const models = [User, Game, GameUser];

export const registerDB = async (app: FastifyInstance) => {
    const sequelize = new Sequelize({
        dialect: "sqlite",
        storage: "./db.sqlite",
        models,
    });

    await sequelize.sync({ force: true });
    app.decorate("sequelize", sequelize);
};

export const startClean = async () => {
    const sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        models,
    });

    await sequelize.sync({ force: true });
    return sequelize;
};
