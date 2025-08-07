import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcrypt';

import { User } from '@/database/models/User/User';
import { UserFinder } from '@/database/models/User/UserFinder';
import { HttpException } from '@/utils/exceptions';

import { Token } from '../auth.types';
import jwtService from './jwt.service';

/*

    user - full user data
    payload - JWT payload shared with client

    TODO: cleanup this shit

*/

class AuthService {
    oauth2: OAuth2Client;

    constructor() {
        this.oauth2 = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    /**
     * Checks if the user is authorized based on the provided token.
     * Will return true if the user is fully authorized, false if in case of ongoing 2FA or not found.
     * @throws HttpException if the token is invalid or user not found.
     * @param token - The JWT token to verify.
     * @returns True if the user is authorized, false otherwise.
     */
    async isAuthorized(token: Token): Promise<boolean> {
        const { email, twoFA } = jwtService.verify(token);

        const user = await UserFinder.getByEmail(email);
        if (!user)
            return false;

        return twoFA == "disabled" || twoFA == "completed";
    }

    /*
     * Google OAuth2 login endpoint
     * Expects a token from the client-side Google Sign-In
     * Returns the user object if successful
     */
    async googleLogin(
        token: Token
    ): Promise<{ user: User; token: string }> {
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

        let user = await UserFinder.getByEmail(payload.email);
        
        // Register user if not exists
        if (!user) {
            user = await User.create({
                email: payload.email!,
                name: payload.name || payload.email?.split('@')[0] || null,
                avatar: payload.picture || null,
                is2FAEnabled: false,
                twoFASecret: null,
                provider: 'google',
            });

            return {
                user: user,
                token: jwtService.getToken(user),
            };
        }

        return { user, token: jwtService.getToken(user) };
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

        const existingUser = await UserFinder.getByEmail(email);
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
    ): Promise<{ user: User; token: string }> {
        if (!email || !password)
            throw new HttpException(
                400,
                'Bad Request: Missing required fields'
            );

        const user = await UserFinder.getByEmail(email);
        if (!user || !user.password)
            throw new HttpException(401, 'Unauthorized: Invalid credentials');

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            throw new HttpException(401, 'Unauthorized: Invalid credentials');

        return { user, token: jwtService.getToken(user) };
    }
}

const authService = new AuthService();
export default authService;
