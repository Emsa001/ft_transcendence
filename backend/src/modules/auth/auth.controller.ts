import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, POST } from 'fastify-decorators';

import { BaseController } from '../base';
import AuthService from './services/auth.service';
import cookieService from './services/cookie.severice';
import JwtService from './services/jwt.service';
import TwoFAService from './services/twoFa.service';

import { OAuth2Payload, UserLogin, UserRegister } from './auth.types';
import { UserFinder } from '@/database/models/User/UserFinder';
import { HttpException } from '@/utils/exceptions';

@Controller('/auth')
export class AuthController extends BaseController {

    @GET('/')
    async getAuthUserController(request: FastifyRequest, reply: FastifyReply) {
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

    @POST('/logout')
    async logoutUserController(request: FastifyRequest, reply: FastifyReply) {

        return reply
            .clearCookie('session', {
                path: '/',
            })
            .send({ success: true });
    }

    /**
     * Initiate Google OAuth2 redirect flow
     * Returns the Google authorization URL
     */
    @GET('/google')
    async googleAuthController(request: FastifyRequest, reply: FastifyReply) {
        try {
            const authUrl = AuthService.getGoogleAuthUrl();
            
            return reply.status(200).send({ authUrl });
        } catch (error: unknown) {
            this.respondWithError(reply, error);
        }
    }

    /**
     * Handle Google OAuth2 callback
     * Processes the authorization code and authenticates the user
     */
    @GET('/google/callback')
    async googleCallbackController(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { code, error } = request.query as { code?: string; error?: string };

            if (error) {
                // Redirect to frontend with error
                return reply.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth?error=${encodeURIComponent(error)}`);
            }

            if (!code) {
                return reply.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth?error=no_code`);
            }

            const { user, token: session } = await AuthService.handleGoogleCallback(code);

            // Set the session cookie
            reply.setCookie('session', session, cookieService.createSession());

            // Redirect to frontend with success indicator
            const redirectUrl = user.is2FAEnabled 
                ? `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth?success=true&require2fa=true`
                : `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth?success=true`;

            return reply.redirect(redirectUrl);
        } catch (error: unknown) {
            console.error('Google callback error:', error);
            return reply.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth?error=auth_failed`);
        }
    }

    @POST('/2fa/verify')
    async oauth2VerifyController(request: FastifyRequest, reply: FastifyReply) {
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
                        cookieService.createSession()
                    )
                    .send({ success: true });
            }

            return reply.send({ success: true });
        } catch (error: unknown) {
            this.respondWithError(reply, error);
        }
    }

    @POST('/2fa/setup')
    async setup2FAController(request: FastifyRequest, reply: FastifyReply) {
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


    // Beqas


    @POST('/register')
    async registerUserController(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { email, name, password } = request.body as UserRegister;
            const user = await AuthService.register(email, name, password);
            reply.send(user);
        } catch (error: unknown) {
            this.respondWithError(reply, error);
        }
    }

    @POST('/login')
    async loginUserController(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { email, password } = request.body as UserLogin;
            const { user, token } = await AuthService.login(email, password);

            reply
                .setCookie('session', token, cookieService.createSession())
                .send({
                    user: user.is2FAEnabled ? { twoFa: true } : user,
                });
        } catch (error: unknown) {
            this.respondWithError(reply, error);
        }
    }
}
