import { FastifyInstance } from "fastify";
import { Sequelize } from "sequelize-typescript";
import { User } from "./models/User/User";
import { Game } from "./models/Game/Game";
import { GameUser } from "./models/Game/GameUser";
import { UserFriends } from "./models/User/UserFriends";
import { Tournament } from "./models/Tournaments/Tournament";
import { TournamentUser } from "./models/Tournaments/TournamentUser";
import { Message } from "./models/Message/Message";
import { BlockedUsers } from "./models/User/BlockedUsers";
import { GameRooms } from "@/modules/game/services/registry.service";
import { DatabaseExampleFeed } from "./feed";
import { TournamentRooms } from "@/modules/tournament/services/registry.service";

const models = [
    User,
    UserFriends,
    BlockedUsers,
    Message,
    Game,
    GameUser,
    Tournament,
    TournamentUser,
];

export const registerDB = async (app: FastifyInstance) => {
    const sequelize = new Sequelize({
        dialect: "sqlite",
        storage: "./db.sqlite",
        logging: false,
        models,
    });

    await sequelize.sync({ force: false });
    app.decorate("sequelize", sequelize);

    await GameRooms.init();
    await TournamentRooms.init();

    // Feed database with example data
    // await DatabaseExampleFeed.feed({
    //     users: 50,
    //     // games: 1,
    // });
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
