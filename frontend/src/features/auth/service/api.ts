import { AxiosResponse } from "axios";
import { APIService } from "@shared/lib/api";
import { TwoFaAction } from "shared";
import { AuthResponse, User } from "../types";

class AuthApi extends APIService {
    /**
     * Get Google OAuth2 redirect URL
     * @returns Object containing the authorization URL
     */
    async getGoogleAuthUrl(): Promise<{ authUrl: string } | null> {
        try {
            const response: AxiosResponse<{ authUrl: string }> =
                await this.api.get("/auth/google");
            return response.data;
        } catch (error) {
            console.error("Error getting Google auth URL:", error);
            return null;
        }
    }

    /**
     * Fetch user data
     * @returns User object if fully authenticated, or throws '2FA_REQUIRED' if 2FA needed
     */
    async getAuthSession(): Promise<AuthResponse> {
        const response: AxiosResponse<AuthResponse> = await this.api.get(
            "/auth",
            {
                withCredentials: true,
            }
        );

        return response.data;
    }

    /**
     * Logout user
     * @returns void
     */
    async logout(): Promise<void> {
        await this.api.post("/auth/logout");
    }

    /**
     * Initialize 2FA setup
     * @returns AxiosResponse containing QR code and secret key
     */
    async initiate2FASetup(): Promise<{ qrImageUrl: string; secret: string }> {
        const response = await this.api.post("/auth/2fa/setup");
        return response.data;
    }

    /**
     * Verify 2FA code
     * @param code - 2FA verification code
     * @param action - Action to perform (login, enable, disable)
     * @returns AxiosResponse containing verification result
     */
    async verify2FACode(code: string, action: TwoFaAction): Promise<boolean> {
        try {
            const response = await this.api.post("/auth/2fa/verify", {
                code,
                action,
            });
            return response.data.success;
        } catch (error) {
            console.error("Error verifying 2FA code:", error);
            return false;
        }
    }

    async register(username: string, password: string): Promise<User> {
        const response = await this.api.post("/auth/register", {
            username,
            password,
        });

        return response.data;
    }

    async login(username: string, password: string): Promise<User> {
        const response = await this.api.post("/auth/login", {
            username,
            password,
        });

        return response.data;
    }
}

const service = new AuthApi();
export default service;
