import { FastifyInstance } from 'fastify';
import { Sequelize } from 'sequelize-typescript';
import { User } from './models/User/User';

export const registerDB = async (app: FastifyInstance) => {
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './db.sqlite',
        models: [User],
    });

    await sequelize.sync({ force: true});
    app.decorate('sequelize', sequelize);
};
