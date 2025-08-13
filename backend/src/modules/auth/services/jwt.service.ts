import jwt from 'jsonwebtoken';
import { HttpException } from '@/utils/exceptions';
import { User } from '@/database/models/User/User';

import { JWTPayload, Token } from '../auth.types';

class JWTService {
    private secret: string;

    constructor() {
        this.secret = process.env.JWT_SECRET || 'default_secret';
    }

    getToken(user: User): string {
        if (!user) {
            throw new HttpException(401, 'Unauthorized: User not found');
        }

        const payload: JWTPayload = {
            email: user.email,
            twoFA: user.is2FAEnabled ? 'started' : 'disabled',
        };

        return this.sign(payload, '1d');
    }

    sign(payload: JWTPayload, expiresIn: string = '1h'): string {
        if (!payload)
            throw new HttpException(
                400,
                'Payload is required for signing the token'
            );

        const token = jwt.sign(payload, this.secret, {
            expiresIn,
        } as jwt.SignOptions);
        return token;
    }

    decode(token: Token): JWTPayload | null {
        if (!token)
            throw new HttpException(400, 'Token is required for decoding');

        const decoded = jwt.decode(token) as JWTPayload;
        return decoded;
    }

    verify(token: Token): JWTPayload {
        if (!token)
            throw new HttpException(
                401,
                'Unauthorized: No session token provided'
            );

        const payload = jwt.verify(token, this.secret) as JWTPayload;
        return payload;
    }
}

const jwtService = new JWTService();
export default jwtService;
