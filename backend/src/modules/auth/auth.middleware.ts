import { FastifyReply, FastifyRequest } from "fastify";
import { HttpException } from "@/utils/exceptions";
import authService from "./services/auth.service";
import { User } from "@/database/models/User/User";
import { WebSocket } from "@fastify/websocket";

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
        const token = request.cookies.session;

        const { user, status } = await authService.isAuthorized(token);
        if (!status || !user)
            throw new HttpException(401, "Missing or invalid token");

        request.user = user;

        return method.call(this, request, reply);
    };

    return descriptor;
}

export function WS_AUTHORIZED(
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
) {
    const method = descriptor.value;

    descriptor.value = async function (
        connection: WebSocket,
        request: FastifyRequest
    ) {
        const token = request.cookies.session;
        const { user, status } = await authService.isAuthorized(token);

        if (!status || !user) {
            connection.close();
            return;
        }

        request.user = user;
        return method.call(this, connection, request);
    };

    return descriptor;
}

declare module "fastify" {
    export interface FastifyRequest {
        user: User;
    }
}
