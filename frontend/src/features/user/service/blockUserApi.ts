import { AxiosResponse } from "axios";
import { APIService } from "@shared/lib/api";
import { UserDTOType } from "shared";
import { Toast } from "@shared/lib/Toast";

class BlockUserApi extends APIService {
    async getAll(): Promise<UserDTOType[] | null> {
        try {
            const response: AxiosResponse<UserDTOType[]> =
                await this.api.get("/blocked/all");
            return response.data;
        } catch (error) {
            console.error("Error fetching all blocked users:", error);
            return null;
        }
    }

    async blockUser(userId: number): Promise<boolean> {
        try {
            await this.api.post(`/block/${userId}`);
            return true;
        } catch (error: any) {
            Toast.error(error.response.data.message);
            return false;
        }
    }

    async unblockUser(userId: number): Promise<void> {
        try {
            await this.api.post(`/unblock/${userId}`);
        } catch (error) {
            console.error("Error unblocking user:", error);
        }
    }

    async amIBlockedByUser(userId: number): Promise<boolean> {
        try {
            const response = await this.api.get(`/blocked/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error checking if user is blocked:", error);
            return Promise.reject(error);
        }
    }

    async amIBlockedByUser(userId: number): Promise<boolean> {
        try {
            const response = await this.api.get(`/blocked/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error checking if user is blocked:", error);
            return Promise.reject(error);
        }
    }
}

const service = new BlockUserApi({ path: "/user" });
export default service;
