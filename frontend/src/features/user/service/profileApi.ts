import { AxiosResponse } from "axios";
import { APIService } from "@shared/lib/api";

class ProfileApi extends APIService {
    async getUser(): Promise<User> {
        try {
            const response: AxiosResponse<AuthResponse> = await this.api.get(
                "/user",
                {
                    withCredentials: true,
                }
            );
            return response.data as unknown as User;
        } catch (error) {
            console.error("Error during Google token verification:", error);
            return Promise.reject(error);
        }
    }

    async updateUserPicture(file: File): Promise<string> {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await this.api.post("/user/picture", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });
            return response.data.picture as string;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }

    async updateUser(name: string, email: string): Promise<User> {
        try {
            const response = await this.api.post("/user/edit", {
                userName: name,
                userEmail: email,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });
            console.log("Updated user:", response.data);
            return response.data.user as User;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }
}

const service = new ProfileApi(
    process.env.FT_REACT_PUBLIC_API_HOST || "http://localhost:3000"
);
export default service;
