import { AxiosResponse } from "axios";
import { APIService } from "@shared/lib/api";
import { UserDTOType } from "shared";
import { Toast } from "@shared/lib/Toast";

class FriendsApi extends APIService {
    async getAllFriends(): Promise<UserDTOType[] | null> {
        try {
            const response: AxiosResponse<UserDTOType[]> =
                await this.api.get("/friends/all");
            return response.data;
        } catch (error) {
            console.error("Error fetching all friends:", error);
            return null;
        }
    }

    async getFriendRequests(): Promise<UserDTOType[] | null> {
        try {
            const response: AxiosResponse<UserDTOType[]> =
                await this.api.get("/friends/requests");
            return response.data;
        } catch (error) {
            console.error("Error fetching friend requests:", error);
            return null;
        }
    }

    async getAllSentRequests(): Promise<UserDTOType[] | null> {
        try {
            const response: AxiosResponse<UserDTOType[]> = await this.api.get(
                "/friends/requests/sent"
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching all sent friend requests:", error);
            return null;
        }
    }

    async addFriend(friendId: number) {
        try {
            const response = await this.api.post(`/friends/add`, { friendId });
            Toast.success("Friend request sent successfully.");
            return response.data;
        } catch (error: any) {
            Toast.error(error.response.data.message);
        }
    }

    async acceptFriendRequest(friendId: number) {
        try {
            await this.api.post(`/friends/accept`, { friendId });
        } catch (error: any) {
            Toast.error(error.response.data.message);
        }
    }

    async removeFriend(friendId: number) {
        try {
            await this.api.post(`/friends/remove`, { friendId });
        } catch (error: any) {
            Toast.error(error.response.data.message);
        }
    }

    async getUserByIdOrUsername(
        idOrUsername: string | number
    ): Promise<UserDTOType | null> {
        try {
            const response: AxiosResponse<UserDTOType> = await this.api.get(
                `/user/${idOrUsername}`
            );
            if (!response.data) return null;
            return response.data;
        } catch (error) {
            console.error("Error fetching user by ID or username:", error);
            return null;
        }
    }
}

const service = new FriendsApi({ path: "/" });
export default service;
