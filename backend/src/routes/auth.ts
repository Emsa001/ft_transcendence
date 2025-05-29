// routes/auth.ts
import { FastifyInstance } from "fastify";
import { OAuth2Client } from "google-auth-library";
import "@fastify/cookie";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default async function authRoutes(fastify: FastifyInstance) {
    fastify.post("/auth/logout", async (request, reply) => {
        reply
            .clearCookie("session", {
                path: "/",
            })
            .send({ success: true });
    });

    fastify.get("/auth/google/user", async (request, reply) => {
        const token = request.cookies.session;

        if (!token) {
            return reply.code(401).send({ error: "Not authenticated" });
        }

        // Optionally re-verify token, or decode if using your own JWT
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) return reply.code(401).send({ error: "Invalid token" });

        return reply.send({
            user: {
                name: payload.name,
                email: payload.email,
                picture: payload.picture,
                sub: payload.sub,
            },
        });
    });

    fastify.post("/auth/google", async (request, reply) => {
        const { token } = request.body as { token: string };

        if (!token) {
            return reply.code(400).send({ error: "Missing token" });
        }

        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            if (!payload) throw new Error("Invalid token");

            const user = {
                name: payload.name,
                email: payload.email,
                picture: payload.picture,
                sub: payload.sub,
            };

            // Set secure HTTP-only cookie
            reply
                .setCookie("session", token, {
                    path: "/",
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 60 * 60 * 24, // 1 day
                })
                .send({ user });
        } catch (err) {
            console.error("Google token verification failed", err);
            return reply.code(401).send({ error: "Invalid token" });
        }
    });
}
