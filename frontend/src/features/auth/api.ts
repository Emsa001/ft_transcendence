import { AxiosResponse } from "axios";
import type { AuthResponse } from "./types";
import { APIService } from "@shared/lib/api";

class AuthApi extends APIService {
    /**
      * Authenticate user with Google
      * @param token - Google ID token
      * @returns AuthResponse containing user data and access token
    */
    async googleAuth(token: string): Promise<AuthResponse> {
        try {
            const response: AxiosResponse<AuthResponse> = await this.api.post("/auth/google", { token });
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
    async getUser(): Promise<AuthResponse> {
        try {
            const response: AxiosResponse<AuthResponse> = await this.api.get("/auth/user", { withCredentials: true });
            return response.data;
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
    async initiate2FASetup(email: string): Promise<{ qrImageUrl: string; secret: string }> {
        try {
            const response = await this.api.post("/auth/2fa/setup", { email });
            return response.data;
        } catch (error) {
            console.error("Error during 2FA initialization:", error);
            return Promise.reject(error);
        }
    }

    /**
      * Verify 2FA code
      * @param code - 2FA verification code
      * @returns AxiosResponse containing verification result
    */
    async verify2FACode(email:string, code: string): Promise<{ success: boolean }> {
        try {
            const response = await this.api.post("/auth/2fa/verify", { email, code });
            return response.data;
        } catch (error) {
            console.error("Error during 2FA verification:", error);
            return Promise.reject(error);
        }
    }

    /**
     * Enable 2FA for the user
     * @param email - User's email
     * @param code - 2FA verification code
     * @returns AxiosResponse containing success status
     */
    async enable2FA(email: string, code: string): Promise<{ success: boolean }> {
        try {
            const response = await this.api.post("/auth/2fa/enable", { email, code });
            return response.data;
        } catch (error) {
            console.error("Error enabling 2FA:", error);
            return Promise.reject(error);
        }
    }

    /**
     * Disable 2FA for the user
     * @returns AxiosResponse containing success status
     */
    async disable2FA(email: string, code: string): Promise<{ success: boolean }> {
        try {
            const response = await this.api.post("/auth/2fa/disable", { email, code });
            return response.data;
        } catch (error) {
            console.error("Error disabling 2FA:", error);
            return Promise.reject(error);
        }
    }
}

const service = new AuthApi(process.env.FT_REACT_PUBLIC_API_HOST || "http://localhost:3000");
export default service;
