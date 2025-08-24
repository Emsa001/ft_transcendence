import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, DELETE, GET, POST } from "fastify-decorators";
import { UserEditableData } from "shared";

import { BaseController } from "../base";
import { UserGamesService } from "./services/user.games";
import { User } from "@/database/models/User/User";
import { HttpException } from "@/utils/exceptions";
import jwtService from "../auth/services/jwt.service";
import cookieService from "../auth/services/cookie.service";
import userAccountService from "./services/user.account";
import { WebSocket } from "@fastify/websocket";
import userStatusService from "./services/user.status";

@Controller("/user")
export class UserController extends BaseController {
    @GET("/all")
    async getUsers(_: FastifyRequest, reply: FastifyReply) {
        const users = await User.findAll();
        return reply.send(users.map((user) => user.toDTO()));
    }

    @GET("/:id")
    async getUserById(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };

        if (Number.isNaN(Number(id))) {
            const user = await User.findByUsername(id);
            if (!user)
                throw new HttpException(404, "User not found");
            return reply.send(user.toDTO());
        }
        const user = await User.findById(Number(id));
        return reply.send(user?.toDTO());
    }

    @GET("/:id/history")
    async getUserGameHistory(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id?: string };
        const { limit, start, end } = request.query as {
            limit?: string;
            start?: string;
            end?: string;
        };

        if (!id || Number.isNaN(Number(id)))
            throw new HttpException(400, "Invalid user ID");

        const games = await UserGamesService.getHistory(Number(id), {
            limit: limit ? Number(limit) : undefined,
            start: start ? new Date(start) : undefined,
            end: end ? new Date(end) : undefined,
        });

        return reply.send(games.map((game) => game.toDTO()));
    }

    @GET("/:id/stats")
    async getUserStats(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id?: string };
        if (!id || Number.isNaN(Number(id)))
            throw new HttpException(400, "Invalid user ID");

        const stats = await UserGamesService.getStatistics(Number(id));
        return reply.send(stats);
    }

    @POST("/picture")
    async uploadProfilePicture(request: FastifyRequest, reply: FastifyReply) {
        const token = request.cookies.session;
        const { id } = jwtService.verify(token);
        const data = await request.file();

        const pictureURL = await userAccountService.uploadPicture(id, data);
        return reply.send({ success: true, picture: pictureURL });
    }

    @POST("/edit")
    async editProfile(request: FastifyRequest, reply: FastifyReply) {
        const data = request.body as UserEditableData;
        const token = request.cookies.session;
        const { id } = jwtService.verify(token);

        const user = await userAccountService.editProfile(id, data);

        const newToken = jwtService.getToken(user);

        reply.setCookie("session", newToken, cookieService.createSession());
        return reply.send({ success: true, user });
    }

    @POST("/delete")
    async deleteAccount(request: FastifyRequest, reply: FastifyReply) {
        const token = request.cookies.session;
        const { id } = jwtService.verify(token);

        await userAccountService.deleteAccount(id);

        reply.clearCookie("session");
        return reply.send({ success: true });
    }

    @GET("/status", { websocket: true })
    async getStatus(connection: WebSocket, req: FastifyRequest) {
        try {
            let userId: number;
            const token = req.cookies.session;

            if (!token) userId = Date.now();
            else userId = jwtService.verify(token).id;

            userStatusService.addUser(userId, connection);

            connection.on("close", () => {
                userStatusService.removeUser(userId, connection);
            });
        } catch (err) {
            connection.close();
        }
    }
}
