import { FastifyReply, FastifyRequest } from "fastify";
import { HttpException } from "@/utils/exceptions";
import AuthService from "./services/auth.service";

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

        const isAuthorized = await AuthService.isAuthorized(token);
        if (!isAuthorized)
            throw new HttpException(401, "Missing or invalid token");

        return method.call(this, request, reply);
    };

    return descriptor;
}
