import { AxiosResponse } from "axios";
import { APIService } from "@shared/lib/api";
import { UserDTOType } from "shared";
import { Alert } from "@shared/components/Alert";

class BlockUserApi extends APIService {
    async getAll(): Promise<UserDTOType[]> {
        try {
            const response: AxiosResponse<UserDTOType[]> =
                await this.api.get("/blocked/all");
            return response.data;
        } catch (error) {
            console.error("Error fetching all blocked users:", error);
            return Promise.reject(error);
        }
    }

    async blockUser(userId: number): Promise<void> {
        try {
            await this.api.post(`/block/${userId}`);
        } catch (error: any) {
            Alert.error(error.response.data.message);
        }
    }

    async unblockUser(userId: number): Promise<void> {
        try {
            await this.api.post(`/unblock/${userId}`);
        } catch (error) {
            console.error("Error unblocking user:", error);
            return Promise.reject(error);
        }
    }
}

const service = new BlockUserApi({ path: "/user" });
export default service;
