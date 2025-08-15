import { AxiosResponse } from "axios";
import { APIService } from "@shared/lib/api";
import { GetStatisticsResponse } from "shared";

class StatsApi extends APIService {
    /**
     * Get game statistics
     * @param gameId - ID of the game to fetch stats for
     * @returns Game statistics object
     */
    async getUserStats(userId: string): Promise<GetStatisticsResponse | null> {
        try {
            const response: AxiosResponse<GetStatisticsResponse> =
                await this.api.get(`/user/${userId}/stats`);
            return response.data;
        } catch (error) {
            console.error("Error getting user stats:", error);
            return null;
        }
    }
}

const service = new StatsApi();
export default service;
