import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, POST } from 'fastify-decorators';
import { HttpException } from '@/utils/exceptions';

import { BaseController } from '../base';
import { User } from '@/database/models/User';
import jwtService from '../auth/services/jwt.service';

@Controller('/login')
export class LoginController extends BaseController {
    maxCookieAge = Number(process.env.COOKIE_MAX_AGE) || 60 * 60 * 24; // Default to 1 day

    @GET('/')
    async verifyUser(request: FastifyRequest, reply: FastifyReply) {
        try {
            const token = request.cookies.session;
            const { email, twoFA } = jwtService.verify(token);
            if (twoFA) {
                return reply.send({ twoFa: true });
            }

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

    @POST('/logout')
    async logoutUser(request: FastifyRequest, reply: FastifyReply) {
        return reply
            .clearCookie('session', {
                path: '/',
            })
            .send({ success: true });
    }
}
