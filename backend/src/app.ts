import "reflect-metadata";
import "dotenv/config";

import Fastify from "fastify";

import { bootstrap } from "fastify-decorators";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import middie from "@fastify/middie";

import { registerDB } from "./database/client";
import { UserController } from "./modules/user/user.controller";
import { AuthController } from "./modules/auth/auth.controller";

import metricsPlugin from "fastify-metrics";
import { DatabaseExampleFeed } from "./database/feed";
import { GameController } from "./modules/game/game.controller";
import { HttpException } from "./utils/exceptions";

export default async function App() {
    const app = Fastify({ logger: true });

    // Fastify Modules
    await app.register(cors, { origin: process.env.ORIGIN, credentials: true });
    await app.register(cookie, {
        secret: process.env.COOKIE_SECRET || "very-secret-cookie-key",
    });
    await app.register(middie);
    await app.register(bootstrap, {
        controllers: [UserController, AuthController, GameController],
    });

    await app.setErrorHandler((error: HttpException, request, reply) => {
        request.log.error(error);
        reply.status(error.statusCode || 500).send({
            error: error.message || "Internal Server Error",
        });
    });

    // Register Database client and models
    await registerDB(app);

    // Feed database with example data
    new DatabaseExampleFeed();

    // fastify-metrics for Prometheus Database
    await app.register(metricsPlugin, {
        endpoint: "/metrics",
        defaultMetrics: { enabled: true },
        routeMetrics: { enabled: true },
    });

    return app;
}
