import 'reflect-metadata';
import 'dotenv/config';

import Fastify from 'fastify';

import { bootstrap } from 'fastify-decorators';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';

import { registerDB } from './database/client';
import { UserController } from './modules/user/controller';

export default async function App() {
    const app = Fastify({ logger: true });

    // Fastify Modules
    await app.register(cors, { origin: process.env.ORIGIN, credentials: true });
    await app.register(cookie, {
        secret: process.env.COOKIE_SECRET || 'very-secret-cookie-key',
    });

    // Database
    await registerDB(app);

    // Register decorators
    app.register(bootstrap, {
        controllers: [UserController],
    });

    return app;
}
