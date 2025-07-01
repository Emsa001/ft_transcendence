import { User } from '@/database/models/User';
import { TokenPayload } from 'google-auth-library';

export type Token = string | undefined;
export type Auth2Action = 'login' | 'enable' | 'disable';
export type Provider = 'google' | 'email';

export interface TwoFASecret {
    base32: string; // The base32 encoded secret
    otpauth_url: string; // The URL for the OTP Auth app
    qrImageUrl: string; // The QR code image URL
}

export interface JWTPayload {
    email: string; // The user's email
    provider: Provider; // The authentication provider (e.g., 'google')
    twoFA?: boolean; // Optional flag indicating if 2FA is in progress
}

export interface AuthorizationResponse {
    user: User | null; // The authenticated user object or null if not authenticated
    publicUser: User | null; // The public user object or null if not authenticated
    payload: TokenPayload | JWTPayload; // The token payload containing user information
}
