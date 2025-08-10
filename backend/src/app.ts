import 'reflect-metadata';
import 'dotenv/config';

import Fastify from 'fastify';

import { bootstrap } from 'fastify-decorators';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import middie from "@fastify/middie"

import { registerDB } from './database/client';
import { UserController } from './modules/user/user.controller';
import { AuthController } from './modules/auth/auth.controller';

import metricsPlugin from 'fastify-metrics';


export default async function App() {
    const app = Fastify({ logger: true });

    await app.register(middie);

    // Fastify Modules
    await app.register(cors, { origin: process.env.ORIGIN, credentials: true });
    await app.register(cookie, {
        secret: process.env.COOKIE_SECRET || 'very-secret-cookie-key',
    });

    // Database
    await registerDB(app);

    // Register decorators
    app.register(bootstrap, {
        controllers: [UserController, AuthController],
    });

    // fastify-metrics for Prometheus Database
    await app.register(metricsPlugin, { 
        endpoint: '/metrics',
        defaultMetrics: { enabled: true },
        routeMetrics: { enabled: true},
    });

    return app;
}
