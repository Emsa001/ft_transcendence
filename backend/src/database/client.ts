import { FastifyInstance } from "fastify";
import { Sequelize } from "sequelize-typescript";
import { User } from "./models/User/User";
import { Game } from "./models/Game/Game";
import { GameUser } from "./models/Game/GameUser";
import { DatabaseExampleFeed } from "./feed";
import { Tournament } from "./models/Tournaments/Tournament";
import { TournamentUser } from "./models/Tournaments/TournamentUser";
import path from "path";
import { fileURLToPath } from "url";

const models = [User, Game, GameUser, Tournament, TournamentUser];

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const registerDB = async (app: FastifyInstance) => {
    const sequelize = new Sequelize({
        dialect: "sqlite",
        storage: path.resolve(__dirname, "../db.sqlite"), // now works in ESM
        logging: false,
        models,
    });

    await sequelize.sync({ force: true });
    app.decorate("sequelize", sequelize);

    // Feed database with example data
    await DatabaseExampleFeed.feed({
        users: 4,
        games: 1,
    });
};

export const startClean = async () => {
    const sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        models,
    });

    await sequelize.sync();
    return sequelize;
};
