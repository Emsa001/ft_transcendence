import Fastify from "fastify";
import cors from "@fastify/cors";
import authRoutes from "./routes/auth";
import cookie from "@fastify/cookie";
import dotenv from "dotenv";

dotenv.config();

const fastify = Fastify({ logger: true });

fastify.register(cors, {
    origin: ["http://localhost:3000"],
    credentials: true,
});

fastify.register(cookie, {
  secret: process.env.COOKIE_SECRET || "your-secret",
});

fastify.register(authRoutes);

fastify.listen({ port: Number(process.env.PORT) || 8000, host: "0.0.0.0" }, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`Server running at ${address}`);
});
