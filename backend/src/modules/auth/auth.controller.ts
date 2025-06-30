import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, POST } from 'fastify-decorators';
import { HttpException } from '@/utils/exceptions';

import { BaseController } from '../base';
import AuthService from './services/auth.service';
import TwoFAService from './services/twoFa.service';
import { Auth2Action } from './auth.types';

@Controller('/auth')
export class AuthController extends BaseController {
    maxCookieAge = Number(process.env.COOKIE_MAX_AGE) || 60 * 60 * 24; // Default to 1 day

    @GET('/')
    async verifyUser(request: FastifyRequest, reply: FastifyReply) {
        try {
            const token = request.cookies.session;
            const { publicUser } = await AuthService.verify(token);
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
            const user = await AuthService.googleLogin(token);

            reply
                .setCookie('session', token, {
                    path: '/',
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: this.maxCookieAge,
                })
                .send({ user });
        } catch (error: unknown) {
            this.respondWithError(reply, error);
        }
    }

    @POST('/2fa/verify')
    async oauth2Verify(request: FastifyRequest, reply: FastifyReply) {
        try {
            const token = request.cookies.session;
            const { code, action = 'login' } = request.body as {
                code: string;
                action: Auth2Action | undefined;
            };

            const { session, shouldSetCookie } = await TwoFAService.verify(
                token,
                code,
                action
            );

            if (shouldSetCookie) {
                return reply
                    .setCookie('session', session, {
                        path: '/',
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                        maxAge: this.maxCookieAge,
                    })
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
}
