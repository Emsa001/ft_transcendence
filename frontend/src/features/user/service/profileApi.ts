import { AxiosResponse } from "axios";
import { APIService } from "@shared/lib/api";
import { UserDTOType, UserEditableData } from "shared";
import { User } from "@features/auth/types";
import { Alert } from "@shared/components/Alert";

class ProfileApi extends APIService {
    async getAllUsers(): Promise<UserDTOType[]> {
        try {
            const response: AxiosResponse<UserDTOType[]> =
                await this.api.get("/user/all");
            return response.data;
        } catch (error) {
            console.error("Error fetching all users:", error);
            return Promise.reject(error);
        }
    }

    async searchUsers(query: string): Promise<UserDTOType[]> {
        try {
            const response: AxiosResponse<UserDTOType[]> =
                await this.api.get("/user/search", { params: { query } });
            return response.data;
        } catch (error) {
            console.error("Error searching users:", error);
            return Promise.reject(error);
        }
    }

    async getUser(): Promise<User> {
        try {
            const response: AxiosResponse<UserDTOType> =
                await this.api.get("/user");
            return response.data;
        } catch (error) {
            console.error("Error during Google token verification:", error);
            return Promise.reject(error);
        }
    }

    async updateUserPicture(file: File): Promise<string | null> {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await this.api.post("/user/picture", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data.picture as string;
        } catch (error) {
            console.error("API Error:", error);
            return null;
        }
    }

    async updateUser(data: UserEditableData): Promise<User | null> {
        try {
            const response = await this.api.post("/user/edit", data);
            Alert.success("User information updated successfully.");
            return response.data.user as User;
        } catch (error: any) {
            Alert.error(error.response.data.message);
            return null;
        }
    }

    async deleteUser(): Promise<boolean> {
        try {
            const response = await this.api.post("/user/delete");
            return response.data.success;
        } catch (error) {
            console.error("API Error:", error);
            return false;
        }
    }

    async getUserByIdOrUsername(
        idOrUsername: string
    ): Promise<UserDTOType | null> {
        try {
            const response: AxiosResponse<UserDTOType> = await this.api.get(
                `/user/${idOrUsername}`
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching user by ID or username:", error);
            return null;
        }
    }
}

const service = new ProfileApi({});
export default service;
