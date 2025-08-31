import { AxiosResponse } from "axios";
import { APIService } from "@shared/lib/api";
import { UserDTOType, UserEditableData } from "shared";
import { AuthResponse, User } from "@features/auth/types";

class FriendsApi extends APIService {
    async getAllFriends(): Promise<UserDTOType[]> {
        try {
            const response: AxiosResponse<UserDTOType[]> =
                await this.api.get("/friends/all");
            console.log("Fetched all friends:", response.data);
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

    async addFriend(friendId: string): Promise<void> {
        try {
            return await this.api.post(`/friends/add`, { friendId });
        } catch (error) {
            console.error("Error adding friend:", error);
            return Promise.reject(error);
        }
    }

    async acceptFriendRequest(friendId: string): Promise<void> {
        try {
            await this.api.post(`/friends/accept`, { friendId });
        } catch (error) {
            console.error("Error accepting friend request:", error);
            return Promise.reject(error);
        }
    }

    async removeFriend(friendId: string): Promise<void> {
        try {
            await this.api.post(`/friends/remove`, { friendId });
        } catch (error) {
            console.error("Error removing friend:", error);
            return Promise.reject(error);
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
