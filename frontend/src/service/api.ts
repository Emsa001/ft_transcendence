import axios, { AxiosInstance, AxiosResponse } from "axios";
import type { AuthResponse } from "../types/api.ts"; // Assuming you defined types

class ApiService {
    private api: AxiosInstance;

    constructor(baseUrl: string) {
        this.api = axios.create({
            baseURL: baseUrl,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            withCredentials: true,
        });

        this.api.interceptors.response.use(
            response => response,
            error => {
                console.error("API Error:", error.response?.data || error.message);
                return Promise.reject(error);
            }
        );
    }

    /*
        * Authenticate user with Google
        * @param token - Google ID token
        * @returns AuthResponse containing user data and access token
    */
    async GoogleAuth(token: string): Promise<AuthResponse> {
        try {
            const response: AxiosResponse<AuthResponse> = await this.api.post("/auth/google", { token });
            return response.data;
        } catch (error) {
            console.error("Error during Google authentication:", error);
            return Promise.reject(error);
        }
    }

    /*
        * Fetch user data from Google
        * @returns AuthResponse containing user data
    */
    async GoogleUser(): Promise<AuthResponse> {
        try {
            const response: AxiosResponse<AuthResponse> = await this.api.get("/auth/google/user", { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error("Error during Google token verification:", error);
            return Promise.reject(error);
        }
    }

    async logout(): Promise<void> {
        try {
            await this.api.post("/auth/logout");
        } catch (error) {
            console.error("Error during logout:", error);
            return Promise.reject(error);
        }
    }
}

const service = new ApiService(process.env.FT_REACT_PUBLIC_API_HOST || "http://localhost:3000/api");
export default service;
