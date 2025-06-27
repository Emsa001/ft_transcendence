import { FastifyInstance } from 'fastify';
import { Sequelize } from 'sequelize-typescript';
import { User } from './models/User';

export const registerDB = async (app: FastifyInstance) => {
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './dev.sqlite',
        models: [User],
    });

    await sequelize.sync();
    app.decorate('sequelize', sequelize);
};
