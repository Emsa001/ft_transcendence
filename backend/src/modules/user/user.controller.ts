import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, GET, POST } from "fastify-decorators";

import { BaseController } from "../base";
import { UserGamesService } from "./services/user.games";
import { User } from "@/database/models/User/User";
import { HttpException } from "@/utils/exceptions";
import jwtService from "../auth/services/jwt.service";
import cookieService from "../auth/services/cookie.severice";
import userAccountService from "./services/user.account";

@Controller("/user")
export class UserController extends BaseController {
    @GET("/all")
    async getUsers(_: FastifyRequest, reply: FastifyReply) {
        const users = await User.findAll();
        return reply.send(users.map((user) => user.toDTO()));
    }

    @GET("/:id")
    async getUserById(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id?: string };
        if (!id || Number.isNaN(Number(id)))
            throw new HttpException(400, "Invalid user ID");

        const user = await User.findById(Number(id));
        return reply.send(user?.toDTO());
    }

    @GET("/:id/history")
    async getUserGameHistory(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id?: string };
        const { limit } = request.query as { limit?: string };

        if (!id || Number.isNaN(Number(id)))
            throw new HttpException(400, "Invalid user ID");

        const games = await UserGamesService.getHistory(Number(id), {
            limit: limit ? Number(limit) : undefined,
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
        const { email } = jwtService.verify(token);
        const data = await request.file();

        try {
            const pictureURL = await userAccountService.uploadPicture(
                email,
                data
            );
            return reply.send({ success: true, picture: pictureURL });
        } catch (error) {
            return reply
                .status(500)
                .send({ error: "Failed to upload picture" });
        }
    }

    @POST("/edit")
    async editProfile(request: FastifyRequest, reply: FastifyReply) {
        const { userName, userEmail } = request.body as {
            userName: string;
            userEmail: string;
        };
        const token = request.cookies.session;
        const { email } = jwtService.verify(token);
        try {
            const user = await userAccountService.editProfile(email, {
                name: userName,
                email: userEmail,
            });

            const token = jwtService.getToken(user);

            reply.setCookie("session", token, cookieService.createSession());
            return reply.send({ success: true, user });
        } catch (error) {
            return reply
                .status(500)
                .send({ error: "Failed to update profile" });
        }
    }
}
