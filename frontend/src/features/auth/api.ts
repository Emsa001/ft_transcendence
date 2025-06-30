import { AxiosResponse } from "axios";
import { APIService } from "@shared/lib/api";

class AuthApi extends APIService {
    /**
     * Authenticate user with Google
     * @param token - Google ID token
     * @returns AuthResponse containing user data and access token
     */
    async googleAuth(token: string): Promise<AuthResponse> {
        try {
            const response: AxiosResponse<AuthResponse> = await this.api.post("/auth/google", {
                token,
            });
            return response.data;
        } catch (error) {
            console.error("Error during Google authentication:", error);
            return Promise.reject(error);
        }
    }

    /**
     * Fetch user data
     * @returns AuthResponse containing user data
     */
    async getUser(): Promise<User> {
        try {
            const response: AxiosResponse<AuthResponse> = await this.api.get("/auth", {
                withCredentials: true,
            });
            return response.data as unknown as User;
        } catch (error) {
            console.error("Error during Google token verification:", error);
            return Promise.reject(error);
        }
    }

    /**
     * Logout user
     * @returns void
     */
    async logout(): Promise<void> {
        try {
            await this.api.post("/auth/logout");
        } catch (error) {
            console.error("Error during logout:", error);
            return Promise.reject(error);
        }
    }

    /**
     * Initialize 2FA setup
     * @returns AxiosResponse containing QR code and secret key
     */
    async initiate2FASetup(): Promise<{ qrImageUrl: string; secret: string }> {
        try {
            const response = await this.api.post("/auth/2fa/setup");
            return response.data;
        } catch (error) {
            console.error("Error during 2FA initialization:", error);
            return Promise.reject(error);
        }
    }

    /**
     * Verify 2FA code
     * @param code - 2FA verification code
     * @param action - Action to perform (login, enable, disable)
     * @returns AxiosResponse containing verification result
     */
    async verify2FACode(code: string, action: Auth2Action): Promise<{ success: boolean }> {
        try {
            const response = await this.api.post("/auth/2fa/verify", { code, action });
            return response.data;
        } catch (error) {
            console.error("Error during 2FA verification:", error);
            return Promise.reject(error);
        }
    }
}

const service = new AuthApi(process.env.FT_REACT_PUBLIC_API_HOST || "http://localhost:3000");
export default service;
