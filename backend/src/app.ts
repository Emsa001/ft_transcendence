import "reflect-metadata";
import "dotenv/config";

import Fastify, { FastifyInstance } from "fastify";

import { bootstrap } from "fastify-decorators";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import middie from "@fastify/middie";

import { registerDB } from "./database/client";
import { UserController } from "./modules/user/user.controller";
import { AuthController } from "./modules/auth/auth.controller";

import metricsPlugin from "fastify-metrics";
import { GameController } from "./modules/game/game.controller";
import websocketPlugin from "@fastify/websocket";

import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import { FriendsController } from "./modules/friends/friends.controller";
import { TournamentController } from "./modules/tournament/tournament.controller";
import { ChatController } from "./modules/chat/chat.controller";

// import sqlite3 from "sqlite3";
import { register as prometheusRegister } from "prom-client";
import { MetricsGauge } from "./modules/metrics/metrics.service";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicPath = path.join(__dirname, "../public");

let app: FastifyInstance;

export const getApp = () => {
    return app;
};

// --- Prometheus Gauges ---

// --- Prometheus Gauges ---

export default async function App() {
    app = Fastify({
        logger: false,
    });

    // WebSocket support
    await app.register(websocketPlugin);

    // Static files
    await app.register(fastifyStatic, {
        root: publicPath,
        prefix: "/public/",
        decorateReply: false,
        constraints: {},
    });

    // Multipart support
    await app.register(fastifyMultipart, {
        limits: {
            fileSize: 2 * 1024 * 1024, // 2MB limit
        },
    });

    // Fastify Modules
    await app.register(cors, {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    });
    await app.register(cookie, {
        secret: process.env.COOKIE_SECRET || "very-secret-cookie-key",
    });
    await app.register(middie);

    await app.register(bootstrap, {
        controllers: [
            UserController,
            ChatController,
            AuthController,
            GameController,
            FriendsController,
            TournamentController,
        ],
    });

    app.setErrorHandler((error: any, request, reply) => {
        request.log.error(error);

        const status = error.statusCode ?? 500;
        const message = error.message ?? "Internal Server Error";

        reply.status(status).send({ error: message });
    });

    // Register Database client and models
    await registerDB(app);

    await app.register(metricsPlugin, {
        endpoint: "/metrics",
        defaultMetrics: { enabled: true },
        routeMetrics: { enabled: true },
    });

    const metrics = new MetricsGauge();

    setInterval(async () => {
        await metrics.collect();
    }, 10000);

    return app;
}
