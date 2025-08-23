import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, GET, POST } from "fastify-decorators";

import { BaseController } from "../base";
import AuthService from "./services/auth.service";
import cookieService from "./services/cookie.service";
import JwtService from "./services/jwt.service";
import TwoFAService from "./services/twoFa.service";

import { UserLogin } from "./auth.types";
import { User } from "@/database/models/User/User";
import { HttpException } from "@/utils/exceptions";
import { OAuth2Payload } from "shared";

@Controller("/auth")
export class AuthController extends BaseController {
    @GET("/")
    async getAuthUserController(request: FastifyRequest, reply: FastifyReply) {
        const token = request.cookies.session;
        const { id, twoFA } = JwtService.verify(token);

        const user = await User.findByPk(id);
        if (!user)
            throw new HttpException(401, "Unauthorized: Invalid session token");

        return reply.status(200).send({ user: user.toDTO().full(), twoFA });
    }

    @POST("/logout")
    async logoutUserController(request: FastifyRequest, reply: FastifyReply) {
        return reply
            .clearCookie("session", {
                path: "/",
            })
            .send({ success: true });
    }

    /**
     * Initiate Google OAuth2 redirect flow
     * Returns the Google authorization URL
     */
    @GET("/google")
    async googleAuthController(request: FastifyRequest, reply: FastifyReply) {
        const authUrl = AuthService.getGoogleAuthUrl();
        return reply.status(200).send({ authUrl });
    }

    /**
     * Handle Google OAuth2 callback
     * Processes the authorization code and authenticates the user
     */
    @GET("/google/callback")
    async googleCallbackController(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const url = process.env.FRONTEND_URL || "http://localhost:3000";

        const { code, error } = request.query as {
            code?: string;
            error?: string;
        };

        if (error || !code)
            return reply.redirect(
                `${url}/auth?error=${encodeURIComponent(error || "no_code")}`
            );

        const { user, token: session } =
            await AuthService.handleGoogleCallback(code);

        reply.setCookie("session", session, cookieService.createSession());

        return reply.redirect(
            `${url}/auth?success=true&require2fa=${user.is2FAEnabled}`
        );
    }

    @POST("/2fa/verify")
    async oauth2VerifyController(request: FastifyRequest, reply: FastifyReply) {
        const token = request.cookies.session;
        const { code, action = "login" } = request.body as OAuth2Payload;

        const { session, shouldSetCookie } = await TwoFAService.verify(
            token,
            code,
            action
        );

        if (shouldSetCookie) {
            reply.setCookie("session", session, cookieService.createSession());
        }

        return reply.send({ success: true });
    }

    @POST("/2fa/setup")
    async setup2FAController(request: FastifyRequest, reply: FastifyReply) {
        const token = request.cookies.session;
        const { qrImageUrl, otpauth_url } = await TwoFAService.setup(token);

        return reply.send({
            qrImageUrl,
            otpauth_url,
        });
    }

    // Beqas

    @POST("/register")
    async registerUserController(request: FastifyRequest, reply: FastifyReply) {
        const { username, password } = request.body as UserLogin;
        const { user, token } = await AuthService.register(username, password);
        reply.setCookie("session", token, cookieService.createSession());
        return reply.send({ user });
    }

    @POST("/login")
    async loginUserController(request: FastifyRequest, reply: FastifyReply) {
        const { username, password } = request.body as UserLogin;
        const { user, token } = await AuthService.login(username, password);

        reply.setCookie("session", token, cookieService.createSession());
        return reply.send({
            user: user.is2FAEnabled ? { twoFa: true } : user,
        });
    }
}
