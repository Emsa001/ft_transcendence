import { AxiosResponse } from "axios";
import { APIService } from "@shared/lib/api";
import { GameHistoryFilter, UserDTOType } from "shared";

interface Game {
    id: number;
    status: "waiting" | "finished";
    mode: "normal" | "casual" | "tournament";
    isPrivate: boolean;
    maxScore: number;
    players: UserDTOType[];
    maxPlayers: number;
    winner: string;
    createdAt: string;
    updatedAt: string;
}

interface Statistic {
    amount: number;
    wins: number;
    losses: number;
    winRate: number;
}

class StatsApiService extends APIService {
    /**
     * Get game statistics
     * @param gameId - ID of the game to fetch stats for
     * @returns Game statistics object
     */
    async getUserStats(userId: string | number): Promise<Statistic> {
        const response: AxiosResponse<any> = await this.api.get(
            `/${userId}/stats`
        );
        const stats: Statistic = response.data.total;
        return stats;
    }

    async getUserGameHistory(
        userId: string | number,
        options?: GameHistoryFilter
    ): Promise<Game[]> {
        const response: AxiosResponse<any> = await this.api.get(
            `/${userId}/history`,
            { params: options }
        );
        const games: Game[] = response.data.games;
        return games;
    }
}

const StatsApi = new StatsApiService({ path: "/user" });
export default StatsApi;
