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
import { UserStatusService } from "./services/user.status";
import { AUTHORIZED, WS_AUTHORIZED } from "../auth/auth.middleware";
import { randomUUID } from "crypto";
import { friendsWSService } from "../friends/services/ws.friends";

// async searchUsers(query: string): Promise<UserDTOType[]> {
//     try {
//         const response: AxiosResponse<UserDTOType[]> =
//             await this.api.get("/user/search", { params: { query } });
//         return response.data;
//     } catch (error) {
//         console.error("Error searching users:", error);
//         return Promise.reject(error);
//     }
// }

@Controller("/user")
export class UserController extends BaseController {
    @GET("/all")
    async getUsers(_: FastifyRequest, reply: FastifyReply) {
        const users = await User.findAll();
        return reply.send(users.map((user) => user.toDTO()));
    }

    @GET("/search")
    async searchUsers(request: FastifyRequest, reply: FastifyReply) {
        const { query } = request.query as { query: string };
        const allUsers = await User.findAll();
        const filtered = allUsers.filter((user) =>
            user.username.toLowerCase().includes(query.toLowerCase())
        );
        return reply.send(filtered.map((user) => user.toDTO()));
    }

    @GET("/:id")
    @AUTHORIZED
    async getUserById(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };

        if (Number.isNaN(Number(id))) {
            const user = await User.findByUsername(id);
            if (!user) throw new HttpException(404, "User not found");
            return reply.send(user.toDTO());
        }
        const user = await User.findById(Number(id));
        if (!user) throw new HttpException(404, "User not found");
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
    @AUTHORIZED
    async uploadProfilePicture(request: FastifyRequest, reply: FastifyReply) {
        const data = await request.file();

        const pictureURL = await userAccountService.uploadPicture(
            request.user,
            data
        );
        return reply.send({ success: true, picture: pictureURL });
    }

    @POST("/edit")
    @AUTHORIZED
    async editProfile(request: FastifyRequest, reply: FastifyReply) {
        const data = request.body as UserEditableData;

        const updatedUser = await userAccountService.editProfile(
            request.user,
            data
        );

        const newToken = jwtService.getToken(updatedUser);

        reply.setCookie("session", newToken, cookieService.createSession());
        return reply.send({ success: true, user: updatedUser });
    }

    @POST("/delete")
    @AUTHORIZED
    async deleteAccount(request: FastifyRequest, reply: FastifyReply) {
        await userAccountService.deleteAccount(request.user);

        reply.clearCookie("session");
        return reply.send({ success: true });
    }

    @GET("/blocked/all")
    @AUTHORIZED
    async getBlockedUsers(request: FastifyRequest, reply: FastifyReply) {
        const blockedUsers = await request.user.getBlockedUsers();
        return reply.send(blockedUsers);
    }

    @POST("/block/:id")
    @AUTHORIZED
    async blockUser(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: number };

        await request.user.blockUser(id);
        friendsWSService.notifyUser(Number(id), "FRIEND_REMOVED");

        return reply.send({ success: true });
    }

    @POST("/unblock/:id")
    @AUTHORIZED
    async unblockUser(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };

        await request.user.unblockUser(Number(id));
        return reply.send({ success: true });
    }

    @GET("/status", { websocket: true })
    async getStatus(connection: WebSocket, req: FastifyRequest) {
        try {
            let userId: number;
            const token = req.cookies.session;

            if (!token) userId = Number(randomUUID());
            else userId = jwtService.verify(token).id;

            UserStatusService.addUser(Number(userId), connection);

            connection.on("close", () => {
                UserStatusService.removeUser(Number(userId), connection);
            });
        } catch (err) {
            console.error("WebSocket error:", err);
            connection.close();
        }
    }
}
