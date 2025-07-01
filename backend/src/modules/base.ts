import { HttpException } from "@/utils/exceptions";
import { FastifyReply } from "fastify";

export class BaseController {
    constructor() {

    }

    respondWithError(reply: FastifyReply, error: unknown) {
        console.error('Error:', error);
        if (error instanceof HttpException) {
            return reply
                .status(error.statusCode)
                .send({ error: error.message });
        }

        const message = (typeof error === 'object' && error !== null && 'message' in error)
            ? (error as { message?: string }).message
            : undefined;
        return reply.status(500).send(message || 'Internal Server Error');
    }
}