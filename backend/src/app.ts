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
import { HttpException } from "./utils/exceptions";
import websocketPlugin from "@fastify/websocket";

import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import { FriendsController } from "./modules/friends/friends.controller";
import { TournamentController } from "./modules/tournament/tournament.controller";
import { ChatController } from "./modules/chat/chat.controller";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicPath = path.join(__dirname, "../public");

let app: FastifyInstance;

export const getApp = () => {
    return app;
};

export default async function App() {
    app = Fastify({ logger: false });

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
            fileSize: 5 * 1024 * 1024, // 5MB limit
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

    await app.setErrorHandler((error: HttpException, request, reply) => {
        request.log.error(error);
        reply.status(error.statusCode || 500).send({
            error: error.message || "Internal Server Error",
        });
    });

    // Register Database client and models
    await registerDB(app);

    // fastify-metrics for Prometheus Database
    await app.register(metricsPlugin, {
        endpoint: "/metrics",
        defaultMetrics: { enabled: true },
        routeMetrics: { enabled: true },
    });

    return app;
}
