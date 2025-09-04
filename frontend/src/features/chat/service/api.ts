import { AxiosResponse } from "axios";
import { APIService } from "@shared/lib/api";
import { MessageDTOType } from "shared";

interface ChatData {
    messages: MessageDTOType[];
    hasMore: boolean;
}

export class ChatApi extends APIService {
    async getChatWith(id: number, offset: number = 0): Promise<ChatData> {
        try {
            const response: AxiosResponse<ChatData> = await this.api.get(
                `/get/${id}?offset=${offset}`
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching all friends:", error);
            return Promise.reject(error);
        }
    }
}

const service = new ChatApi({ path: "/chat" });
export default service;
