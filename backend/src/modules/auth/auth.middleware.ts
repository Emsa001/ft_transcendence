import { FastifyReply, FastifyRequest } from 'fastify';
import { HttpException } from '@/utils/exceptions';
import AuthService from './services/auth.service';

export function AUTHORIZED(
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
) {
    const method = descriptor.value;

    descriptor.value = async function (
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {
            const token = request.cookies.session;
            const isAuthorized = await AuthService.isAuthorized(token);
    
            if (!isAuthorized) {
                return reply.status(401).send({
                    error: 'Unauthorized',
                    message: 'Invalid or expired session token'
                });
            }

            return method.call(this, request, reply);
        } catch (error) {
            if (error instanceof HttpException) {
                return reply.status(error.statusCode).send({
                    error: 'Unauthorized',
                    message: error.message
                });
            }
            
            return reply.status(401).send({
                error: 'Unauthorized',
                message: 'Authentication failed'
            });
        }
    };

    return descriptor;
}