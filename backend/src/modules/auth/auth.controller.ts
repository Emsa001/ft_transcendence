import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, POST } from 'fastify-decorators';
import { HttpException } from '@/utils/exceptions';

import { BaseController } from '../base';
import AuthService from './services/auth.service';
import TwoFAService from './services/twoFa.service';
import { OAuth2Payload, UserLogin, UserRegister } from './auth.types';
import JwtService from './services/jwt.service';
import { User } from '@/database/models/User';
import cookieService from './services/cookie.severice';

@Controller('/auth')
export class AuthController extends BaseController {

    @GET('/')
    async verifyUser(request: FastifyRequest, reply: FastifyReply) {
        try {
            const token = request.cookies.session;
            const { email, twoFA } = JwtService.verify(token);

            if (twoFA)
                return reply.send({ twoFa: true });

            const publicUser = await User.getPublicByEmail(email);
            if (!publicUser)
                throw new HttpException(
                    401,
                    'Unauthorized: Invalid session token'
                );

            return reply.send(publicUser);
        } catch (error: unknown) {
            this.respondWithError(reply, error);
        }
    }

    // TODO: Do we need?
    @POST('/logout')
    async logoutUser(request: FastifyRequest, reply: FastifyReply) {
        return reply
            .clearCookie('session', {
                path: '/',
            })
            .send({ success: true });
    }

    @POST('/google')
    async googleLogin(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { token } = request.body as { token: string };
            const { user, payload } = await AuthService.googleLogin(token);

            const session = JwtService.sign(payload, '1d');

            reply
                .setCookie('session', session, cookieService.getAuthSession())
                .send({
                    user: payload.twoFA ? { twoFa: true } : user,
                });
        } catch (error: unknown) {
            this.respondWithError(reply, error);
        }
    }

    @POST('/2fa/verify')
    async oauth2Verify(request: FastifyRequest, reply: FastifyReply) {
        try {
            const token = request.cookies.session;
            const { code, action = 'login' } = request.body as OAuth2Payload;

            const { session, shouldSetCookie } = await TwoFAService.verify(
                token,
                code,
                action
            );

            if (shouldSetCookie) {
                return reply
                    .setCookie('session', session, cookieService.getAuthSession())
                    .send({ success: true });
            }

            return reply.send({ success: true });
        } catch (error: unknown) {
            this.respondWithError(reply, error);
        }
    }

    @POST('/2fa/setup')
    async setup2FA(request: FastifyRequest, reply: FastifyReply) {
        try {
            const token = request.cookies.session;
            const { qrImageUrl, otpauth_url } = await TwoFAService.setup(token);

            return reply.send({
                qrImageUrl,
                otpauth_url,
            });
        } catch (error: unknown) {
            this.respondWithError(reply, error);
        }
    }

    @POST('/register')
    async registerUser(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { email, name, password } = request.body as UserRegister;
            const user = await AuthService.register(email, name, password);
            reply.send(user);
        } catch (error: unknown) {
            this.respondWithError(reply, error);
        }
    }

    @POST('/login')
    async loginUser(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { email, password } = request.body as UserLogin;
            const { user, payload } = await AuthService.login(email, password);

            const session = JwtService.sign(payload, '1d');

            reply
                .setCookie('session', session, cookieService.getAuthSession())
                .send({
                    user: payload.twoFA ? { twoFa: true } : user,
                });
        } catch (error: unknown) {
            this.respondWithError(reply, error);
        }
    }
}
