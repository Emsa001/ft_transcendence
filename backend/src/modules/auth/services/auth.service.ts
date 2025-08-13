import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcrypt';

import { User } from '@/database/models/User/User';
import { HttpException } from '@/utils/exceptions';

import { Token } from '../auth.types';
import jwtService from './jwt.service';

/*

    user - full user data
    payload - JWT payload shared with client

*/

class AuthService {
    oauth2: OAuth2Client;

    constructor() {
        const redirectUri =
            process.env.GOOGLE_REDIRECT_URI ||
            'http://localhost:8000/auth/google/callback';

        this.oauth2 = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            redirectUri
        );

        console.log(
            'Google OAuth2 Client initialized with redirect URI:',
            redirectUri
        );
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

        const user = await User.findByEmail(email);
        if (!user) return false;

        return twoFA == 'disabled' || twoFA == 'completed';
    }

    /*
     * Google OAuth2 login endpoint
     * Expects a token from the client-side Google Sign-In
     * Returns the user object if successful
     */
    async googleLogin(token: Token): Promise<{ user: User; token: string }> {
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

        let user = await User.findByEmail(payload.email);

        // Register user if not exists
        if (!user) {
            user = await User.create({
                email: payload.email!,
                name: payload.name || payload.email?.split('@')[0] || null,
                avatar: payload.picture || null,
                provider: 'google',
            });

            return {
                user: user,
                token: jwtService.getToken(user),
            };
        }

        return { user, token: jwtService.getToken(user) };
    }

    /**
     * Generate Google OAuth2 authorization URL
     * Returns the URL for redirecting users to Google OAuth2 consent screen
     */
    getGoogleAuthUrl(): string {
        const scopes = [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
        ];

        const authUrl = this.oauth2.generateAuthUrl({
            scope: scopes,
            include_granted_scopes: true,
        });

        return authUrl;
    }

    /**
     * Handle Google OAuth2 callback
     * Exchange authorization code for tokens and return user data
     */
    async handleGoogleCallback(
        code: string
    ): Promise<{ user: User; token: string }> {
        if (!code) {
            throw new HttpException(
                400,
                'Bad Request: Authorization code is required'
            );
        }

        try {
            // Exchange authorization code for tokens
            const { tokens } = await this.oauth2.getToken(code);
            this.oauth2.setCredentials(tokens);

            // Verify the ID token
            const ticket = await this.oauth2.verifyIdToken({
                idToken: tokens.id_token!,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            if (!payload || !payload.email) {
                throw new HttpException(
                    401,
                    'Unauthorized: Invalid token payload'
                );
            }

            let user = await User.findByEmail(payload.email);

            // Register user if not exists
            if (!user) {
                user = await User.create({
                    email: payload.email!,
                    name: payload.name || payload.email?.split('@')[0] || null,
                    avatar: payload.picture || null,
                    provider: 'google',
                });

                return {
                    user: user,
                    token: jwtService.getToken(user),
                };
            }

            return { user, token: jwtService.getToken(user) };
        } catch (error) {
            console.error('Google OAuth callback error:', error);
            throw new HttpException(
                401,
                'Unauthorized: Failed to authenticate with Google'
            );
        }
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

        const existingUser = await User.findByEmail(email);
        if (existingUser)
            throw new HttpException(409, 'Conflict: User already exists');

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            name,
            password: hashedPassword,
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

        const user = await User.findByEmail(email);
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
