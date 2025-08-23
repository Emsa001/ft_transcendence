import jwt from "jsonwebtoken";
import { HttpException } from "@/utils/exceptions";
import { User } from "@/database/models/User/User";

import { Token } from "../auth.types";
import { JWTPayload } from "shared";

class JWTService {
    private secret: string;

    constructor() {
        this.secret = process.env.JWT_SECRET || "default_secret";
    }

    getToken(user: User): string {
        if (!user) throw new HttpException(401, "Unauthorized: User not found");

        const payload: JWTPayload = {
            id: user.id,
            twoFA: user.is2FAEnabled ? "started" : "disabled",
        };

        return this.sign(payload, "1d");
    }

    sign(payload: JWTPayload, expiresIn: string = "1h"): string {
        try {
            const token = jwt.sign(payload, this.secret, {
                expiresIn,
            } as jwt.SignOptions);

            return token;
        } catch (error) {
            console.error("Error signing JWT:", error);
            throw new HttpException(
                500,
                "Internal Server Error: Unable to sign token"
            );
        }
    }

    verify(token: Token): JWTPayload {
        try {
            const payload = jwt.verify(token || "", this.secret) as JWTPayload;
            return payload;
        } catch (error) {
            throw new HttpException(401, "Unauthorized: Invalid session token");
        }
    }
}

const jwtService = new JWTService();
export default jwtService;
