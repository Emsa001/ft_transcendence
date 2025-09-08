import { AxiosResponse } from "axios";
import { APIService } from "@shared/lib/api";
import { GameCreationRequest, GameDTOType } from "shared";

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
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async createGame(data?: GameCreationRequest): Promise<AxiosResponse> {
        return this.api.post("/create", data);
    }

    async joinRandom(): Promise<GameDTOType | null> {
        try {
            const response = await this.api.get("/random");
            return response.data;
        } catch (err) {

            return null;
        }
    }
}

const service = new GameApi({ path: "/game" });
export default service as GameApi;
