import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, POST } from 'fastify-decorators';
import { HttpException } from '@/utils/exceptions';

import { BaseController } from '../base';
import AuthService from './services/auth.service';
import TwoFAService from './services/twoFa.service';
import { OAuth2Payload, UserLogin, UserRegister } from './auth.types';
import JwtService from './services/jwt.service';
import cookieService from './services/cookie.severice';
import { UserFinder } from '@/database/models/User/UserFinder';

@Controller('/auth')
export class AuthController extends BaseController {
    @GET('/')
    async getAuthUser(request: FastifyRequest, reply: FastifyReply) {
        try {
            const token = request.cookies.session;
            const { email, twoFA } = JwtService.verify(token);

            const user = await UserFinder.getByEmail(email);
            if (!user)
                throw new HttpException(
                    401,
                    'Unauthorized: Invalid session token'
                );

            return reply.status(200).send({ user: user.toDTO(), twoFA });
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
            const { user, token: session } =
                await AuthService.googleLogin(token);

            reply
                .setCookie('session', session, cookieService.getAuthSession())
                .send({ user: user.toDTO(), twoFA: user.is2FAEnabled });
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
                    .setCookie(
                        'session',
                        session,
                        cookieService.getAuthSession()
                    )
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
            const { user, token } = await AuthService.login(email, password);

            reply
                .setCookie('session', token, cookieService.getAuthSession())
                .send({
                    user: user.is2FAEnabled ? { twoFa: true } : user,
                });
        } catch (error: unknown) {
            this.respondWithError(reply, error);
        }
    }
}
