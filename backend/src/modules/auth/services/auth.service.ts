import { User } from '@/database/models/User';
import { HttpException } from '@/utils/exceptions';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { Token } from '../auth.types';

import jwt from 'jsonwebtoken';

interface AuthorizationResponse {
    user: User | null; // The authenticated user object or null if not authenticated
    publicUser: User | null; // The public user object or null if not authenticated
    payload: TokenPayload; // The token payload containing user information
}

class AuthService {
    oauth2: OAuth2Client;

    constructor() {
        this.oauth2 = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    /*
     * Returns user information if authenticated
     * Expects a secure HTTP-only cookie with the session token
     */
    async verify(token: Token): Promise<AuthorizationResponse> {
        if (!token) {
            throw new HttpException(
                401,
                'Unauthorized: No session token provided'
            );
        }

        // Verify the token with Google OAuth2
        const ticket = await this.oauth2
            .verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            })
            .catch(() => {
                throw new HttpException(401, `Unauthorized: Invalid token`);
            });
        
        const payload = ticket.getPayload();

        if (!payload)
            throw new HttpException(401, 'Unauthorized: Invalid token');
        if (!payload.email)
            throw new HttpException(
                401,
                'Unauthorized: Invalid email for the token'
            );

        const user = await User.getByEmail(payload.email);
        const publicUser = await User.getPublicByEmail(payload.email);
        return { user, publicUser, payload };
    }

    /*
     * Google OAuth2 login endpoint
     * Expects a token from the client-side Google Sign-In
     * Returns the user object if successful
     */
    async googleLogin(token: Token): Promise<User> {
        let { user, payload } = await this.verify(token);

        // Check if user exists in your database
        if (!user) {
            user = await User.create({
                email: payload.email!,
                username: payload.name || payload.email?.split('@')[0] || null,
                picture: payload.picture || null,
                is2FAEnabled: false,
                twoFASecret: null,
            });
        }

        return user;
    }
}

const authService = new AuthService();
export default authService;
