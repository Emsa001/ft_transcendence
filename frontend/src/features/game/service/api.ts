import { AxiosResponse } from "axios";
import { APIService } from "@shared/lib/api";

class GameApi extends APIService {
    async getAllGames(): Promise<AxiosResponse> {
        return this.api.get("/all");
    }

    async getGameById(id: number): Promise<AxiosResponse> {
        return this.api.get(`/${id}`);
    }

    async createGame(): Promise<AxiosResponse> {
        return this.api.post("/create");
    }
}

const service = new GameApi({ path: "/game" });
export default service as GameApi;
