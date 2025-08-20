import { AxiosResponse } from "axios";
import { APIService } from "@shared/lib/api";
import { UserDTOType, UserEditableData } from "shared";
import { AuthResponse, User } from "@features/auth/types";

class FriendsApi extends APIService {
    async getAllUsers(): Promise<UserDTOType[]> {
        try{
            const response = await this.api.get<UserDTOType[]>("/user/all");
            return response.data;
        }
        catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    }

    async addFriend(friendId: number): Promise<void> {
        try {
            await this.api.post(`/user/requestAddFriend`, { friendId });
        } catch (error) {
            console.error("Error adding friend:", error);
            throw error;
        }
    }
}


const friendsApi = new FriendsApi();
export default friendsApi;