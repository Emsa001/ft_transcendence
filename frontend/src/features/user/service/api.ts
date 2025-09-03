import { AxiosResponse } from "axios";
import { APIService } from "@shared/lib/api";
import { GameDTOType, GameHistoryFilter, GetStatisticsResponse } from "shared";

class StatsApiService extends APIService {
    /**
     * Get game statistics
     * @param gameId - ID of the game to fetch stats for
     * @returns Game statistics object
     */
    async getUserStats(
        userId: string | number
    ): Promise<GetStatisticsResponse> {
        const response: AxiosResponse<GetStatisticsResponse> =
            await this.api.get(`/${userId}/stats`);
        return response.data;
    }

    async getUserGameHistory(
        userId: string | number,
        options?: GameHistoryFilter
    ): Promise<GameDTOType[]> {
        const response: AxiosResponse<GameDTOType[]> = await this.api.get(
            `/${userId}/history`,
            { params: options }
        );
        return response.data;
    }
}

const StatsApi = new StatsApiService({ path: "/user" });
export default StatsApi;
