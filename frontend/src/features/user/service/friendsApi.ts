import { AxiosResponse } from "axios";
import { APIService } from "@shared/lib/api";
import { UserDTOType } from "shared";
import { Alert } from "@shared/components/Alert";

class FriendsApi extends APIService {
    async getAllFriends(): Promise<UserDTOType[]> {
        try {
            const response: AxiosResponse<UserDTOType[]> =
                await this.api.get("/friends/all");
            return response.data;
        } catch (error) {
            console.error("Error fetching all friends:", error);
            return Promise.reject(error);
        }
    }

    async getFriendRequests(): Promise<UserDTOType[]> {
        try {
            const response: AxiosResponse<UserDTOType[]> =
                await this.api.get("/friends/requests");
            return response.data;
        } catch (error) {
            console.error("Error fetching friend requests:", error);
            return Promise.reject(error);
        }
    }

    async getAllSentRequests(): Promise<UserDTOType[]> {
        try {
            const response: AxiosResponse<UserDTOType[]> = await this.api.get(
                "/friends/requests/sent"
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching all sent friend requests:", error);
            return Promise.reject(error);
        }
    }

    async addFriend(friendId: number) {
        try {
            await this.api.post(`/friends/add`, { friendId });
            Alert.success("Friend request sent successfully.");
        } catch (error: any) {
            Alert.error(error.response.data.message);
        }
    }

    async acceptFriendRequest(friendId: number) {
        try {
            await this.api.post(`/friends/accept`, { friendId });
        } catch (error: any) {
            Alert.error(error.response.data.message);
        }
    }

    async removeFriend(friendId: number) {
        try {
            await this.api.post(`/friends/remove`, { friendId });
        } catch (error: any) {
            Alert.error(error.response.data.message);
        }
    }

    async getUserByIdOrUsername(
        idOrUsername: string
    ): Promise<UserDTOType | null> {
        try {
            const response: AxiosResponse<UserDTOType> = await this.api.get(
                `/user/${idOrUsername}`
            );
            if (!response.data) return null;
            return response.data;
        } catch (error) {
            console.error("Error fetching user by ID or username:", error);
            return Promise.reject(error);
        }
    }
}

const service = new FriendsApi({ path: "/" });
export default service;
