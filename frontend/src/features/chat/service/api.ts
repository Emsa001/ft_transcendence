import { AxiosResponse } from "axios";
import { APIService } from "@shared/lib/api";
import { MessageDTOType } from "shared";

process.env.FT_REACT_PUBLIC_API_HOST || "http://localhost:3000"

export class ChatApi extends APIService {
    async getChatWith(id: number, offset: number = 0): Promise<MessageDTOType[]> {
        try {
            const response: AxiosResponse<MessageDTOType[]> =
                await this.api.get(`/chat/get/${id}?offset=${offset}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching all friends:", error);
            return Promise.reject(error);
        }
    }
}

const service = new ChatApi(
    process.env.FT_REACT_PUBLIC_API_HOST || "http://localhost:3000"
);
export default service;
