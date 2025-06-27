import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, POST } from 'fastify-decorators';
import { UserService } from './services/userService';

@Controller('/users')
export class UserController {
    private service = new UserService();

    @GET('/')
    async getUsers(_: FastifyRequest, reply: FastifyReply) {
        const users = await this.service.getAll();
        reply.send(users);
    }

    @GET('/:id')
    async getUserById(request: FastifyRequest, reply: FastifyReply) {
        const userId = Number((request.params as { id: string }).id);
        const user = await this.service.getById(userId);
        reply.send(user);
    }

    @POST("/")
    async createUser(request: FastifyRequest, reply: FastifyReply) {
        const userData = request.body as any; // Adjust type as needed
        const newUser = await this.service.create(userData);
        reply.status(201).send(newUser);
    }
}
