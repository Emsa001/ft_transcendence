// routes/auth.ts

import { FastifyInstance } from "fastify";
import { OAuth2Client } from "google-auth-library";
import "@fastify/cookie";

import { generate2FASecret, verify2FACode } from "../utils/generate-2fa";
import jwt from "jsonwebtoken";
import { User } from "../db/models/User";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default async function authRoutes(fastify: FastifyInstance) {
    /*
     * Logout endpoint
     * Clears the secure HTTP-only cookie with the session token
     * Expects a secure HTTP-only cookie with the session token
     */
    fastify.post("/auth/logout", async (request, reply) => {
        reply
            .clearCookie("session", {
                path: "/",
            })
            .send({ success: true });
    });

    /*
     * Google OAuth2 user info endpoint
     * Returns user information if authenticated
     * Expects a secure HTTP-only cookie with the session token
     */
    fastify.get("/auth/user", async (request, reply) => {
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
        if (!payload.email) return reply.code(401).send({ error: "Email not found in token" });

        const user = await User.getPublicByEmail(payload.email);
        return reply.send({ user });
    });

    /*
     * Google OAuth2 login endpoint
     * Expects a token from the client-side Google Sign-In
     * Sets a secure HTTP-only cookie with the session token
     */
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

            let dbUser = await User.getPublicByEmail(payload.email || "");

            // Check if user exists in your database
            if (!dbUser) {
                dbUser = await User.create({
                    email: payload.email,
                    username: payload.name || payload.email?.split("@")[0],
                    picture: payload.picture || null,
                    twoFASecret: null,
                    is2FAEnabled: false,
                });
            }

            // Set secure HTTP-only cookie
            reply
                .setCookie("session", token, {
                    path: "/",
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 60 * 60 * 24, // 1 day
                })
                .send({ user: dbUser });
        } catch (err) {
            console.error("Google token verification failed", err);
            return reply.code(401).send({ error: "Invalid token" });
        }
    });

    /*
     * Two-Factor Authentication (2FA) routes
     * Setup and verify 2FA using TOTP (Time-based One-Time Password)
     */
    fastify.post("/auth/2fa/verify", async (request, reply) => {
        const { code } = request.body as { code: string };
        const sessionToken = request.cookies.session;

        if (!sessionToken) {
            return reply.code(401).send({ error: "Missing session code" });
        }

        try {
            // Get user email from Google token
            const ticket = await client.verifyIdToken({
                idToken: sessionToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            if (!payload || !payload.email) {
                return reply.code(401).send({ error: "Invalid session" });
            }

            const user = await User.getByEmail(payload.email);
            if (!user || !user.twoFASecret || !user.is2FAEnabled) {
                return reply.code(400).send({ error: "2FA not set up for user" });
            }

            const isValid = verify2FACode(user.twoFASecret, code);
            if (!isValid) {
                return reply.code(401).send({ error: "Invalid 2FA token" });
            }

            // Optional: Create your own app-level JWT after 2FA passes
            const appJwt = jwt.sign(
                { userId: user.id, email: user.email, twoFA: true },
                process.env.JWT_SECRET!,
                { expiresIn: "1d" }
            );

            // Store it or return it — your choice
            reply
                .setCookie("session", appJwt, {
                    path: "/",
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 60 * 60 * 24,
                })
                .send({ success: true });
        } catch (err) {
            console.error("2FA verify failed", err);
            return reply.code(500).send({ error: "Server error" });
        }
    });

    /*
     * Two-Factor Authentication (2FA) setup route
     * Generates a 2FA secret and QR code for the user
     * Expects a secure HTTP-only cookie with the session token
     */
    fastify.post("/auth/2fa/setup", async (request, reply) => {
        const sessionToken = request.cookies.session;

        if (!sessionToken) {
            return reply.code(401).send({ error: "Missing session" });
        }

        try {
            const ticket = await client.verifyIdToken({
                idToken: sessionToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            if (!payload?.email) {
                return reply.code(401).send({ error: "Invalid session" });
            }

            const email = payload.email;
            const user = await User.getByEmail(email);
            if (!user) {
                return reply.code(404).send({ error: "User not found" });
            }

            const { base32, qrImageUrl } = await generate2FASecret(email);

            await user.update({
                twoFASecret: base32,
                is2FAEnabled: false,
            });

            return reply.send({ qrImageUrl });
        } catch (err) {
            console.error("2FA setup failed", err);
            return reply.code(500).send({ error: "Server error" });
        }
    });

    /*
     * Two-Factor Authentication (2FA) enable route
     * Confirms and enables 2FA after user scans QR code and enters valid token
     * Expects a secure HTTP-only cookie with the session token
     */
    fastify.post("/auth/2fa/enable", async (request, reply) => {
        const { code } = request.body as { code: string };
        const sessionToken = request.cookies.session;

        if (!sessionToken) {
            return reply.code(401).send({ error: "Missing session" });
        }

        try {
            const ticket = await client.verifyIdToken({
                idToken: sessionToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            if (!payload?.email) {
                return reply.code(401).send({ error: "Invalid session" });
            }

            const user = await User.getByEmail(payload.email);
            console.log("User found:", user?.twoFASecret);
            if (!user || user.twoFASecret === null) {
                return reply.code(400).send({ error: "2FA not initialized" });
            }

            const isValid = verify2FACode(user.twoFASecret, code);
            if (!isValid) {
                return reply.code(401).send({ error: "Invalid 2FA code" });
            }

            await user.update({ is2FAEnabled: true });

            return reply.send({ success: true });
        } catch (err) {
            console.error("2FA enable failed", err);
            return reply.code(500).send({ error: "Server error" });
        }
    });

    /*
     * Two-Factor Authentication (2FA) disable route
     * Disables 2FA for the user after verifying the code
     * Expects a secure HTTP-only cookie with the session token
     */
    fastify.post("/auth/2fa/disable", async (request, reply) => {
        const { code } = request.body as { code: string };
        const sessionToken = request.cookies.session;

        if (!sessionToken) {
            return reply.code(401).send({ error: "Missing session" });
        }

        try {
            const ticket = await client.verifyIdToken({
                idToken: sessionToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            if (!payload?.email) {
                return reply.code(401).send({ error: "Invalid session" });
            }

            const user = await User.getByEmail(payload.email);
            if (!user || !user.is2FAEnabled || !user.twoFASecret) {
                return reply.code(400).send({ error: "2FA not enabled" });
            }

            const isValid = verify2FACode(user.twoFASecret, code);
            if (!isValid) {
                return reply.code(401).send({ error: "Invalid 2FA code" });
            }

            await user.update({ is2FAEnabled: false, twoFASecret: null });

            return reply.send({ success: true });
        } catch (err) {
            console.error("2FA disable failed", err);
            return reply.code(500).send({ error: "Server error" });
        }
    });
}
