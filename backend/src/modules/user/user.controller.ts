import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, POST } from 'fastify-decorators';

import { BaseController } from '../base';
import UserService from './user.service';

@Controller('/users')
export class UserController extends BaseController {
    @GET('/')
    async getUsers(_: FastifyRequest, reply: FastifyReply) {
        const users = await UserService.getAll();
        reply.send(users);
    }

    @GET('/:id')
    async getUserById(request: FastifyRequest, reply: FastifyReply) {
        const userId = Number((request.params as { id: string }).id);
        const user = await UserService.getById(userId);
        reply.send(user);
    }
}
