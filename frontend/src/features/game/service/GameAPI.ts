import { AxiosResponse } from "axios";
import { APIService } from "@shared/lib/api";
import { GameCreationAttributes } from "shared";

class GameApi extends APIService {
    async getAllGames(): Promise<AxiosResponse> {
        return this.api.get("/all");
    }

    async getGameById(id: number): Promise<AxiosResponse> {
        return this.api.get(`/${id}`);
    }

    async getGameByCode(code: string): Promise<AxiosResponse | null> {
        try {
            const response = await this.api.get(`/code/${code}`);
            return response;
        } catch (e) {
            return null;
        }
    }

    async createGame(data?: GameCreationAttributes): Promise<AxiosResponse> {
        return this.api.post("/create", data);
    }
}

const service = new GameApi({ path: "/game" });
export default service as GameApi;
