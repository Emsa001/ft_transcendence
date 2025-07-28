import { User } from '@/database/models/User';
import { HttpException } from '@/utils/exceptions';
import { OAuth2Client } from 'google-auth-library';
import { JWTPayload, Token } from '../auth.types';
import bcrypt from 'bcrypt';
import TwoFAService from './twoFa.service';

class AuthService {
    oauth2: OAuth2Client;

    constructor() {
        this.oauth2 = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    /*
     * Google OAuth2 login endpoint
     * Expects a token from the client-side Google Sign-In
     * Returns the user object if successful
     */
    async googleLogin(
        token: Token
    ): Promise<{ user: User; payload: JWTPayload }> {
        if (!token)
            throw new HttpException(400, 'Bad Request: Token is required');

        const ticket = await this.oauth2
            .verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            })
            .catch(() => {
                throw new HttpException(401, `Unauthorized: Invalid token`);
            });

        const payload = ticket.getPayload();
        if (!payload || !payload.email)
            throw new HttpException(401, 'Unauthorized: Invalid token payload');

        let user = await User.getByEmail(payload.email);
        // Register user if not exists
        if (!user) {
            user = await User.create({
                email: payload.email!,
                name: payload.name || payload.email?.split('@')[0] || null,
                picture: payload.picture || null,
                is2FAEnabled: false,
                twoFASecret: null,
                provider: 'google',
            });

            return {
                user,
                payload: { email: user.email, provider: user.provider },
            };
        }

        // User exists, process authorization for 2fa
        return { user, payload: await TwoFAService.authorize(user) };
    }

    async register(
        email: string,
        name: string,
        password: string
    ): Promise<User> {
        if (!email || !name || !password)
            throw new HttpException(
                400,
                'Bad Request: Missing required fields'
            );

        const existingUser = await User.getByEmail(email);
        if (existingUser)
            throw new HttpException(409, 'Conflict: User already exists');

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            name,
            password: hashedPassword,
            is2FAEnabled: false,
            twoFASecret: null,
            provider: 'email',
        });

        return user;
    }

    async login(
        email: string,
        password: string
    ): Promise<{ user: User; payload: JWTPayload }> {
        if (!email || !password)
            throw new HttpException(
                400,
                'Bad Request: Missing required fields'
            );

        const user = await User.getByEmail(email);
        if (!user || !user.password)
            throw new HttpException(401, 'Unauthorized: Invalid credentials');

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            throw new HttpException(401, 'Unauthorized: Invalid credentials');

        return { user, payload: await TwoFAService.authorize(user) };
    }
}

const authService = new AuthService();
export default authService;
