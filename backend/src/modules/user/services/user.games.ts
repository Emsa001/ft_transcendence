import { Game } from "@/database/models/Game/Game";
import { User } from "@/database/models/User/User";
import { Op } from "sequelize";

interface GetStatisticsResponse {
    totalGames: number;
    wins: number;
    losses: number;
    winRate: number;
}

interface GameHistoryFilter {
    start?: Date;
    end?: Date;
    limit?: number;
}
export class UserGamesService {
    static async getHistory(
        user: User | number,
        { start, end, limit = 30 }: GameHistoryFilter = {}
    ): Promise<Game[]> {
        if (typeof user === "number") user = await User.findById(user);

        const now = new Date();
        if (!start) start = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24h ago
        if (!end) end = now;

        const games = await user.getGames({
            where: {
                createdAt: {
                    [Op.gte]: start,
                    [Op.lte]: end,
                },
            },
            order: [["createdAt", "DESC"]],
            limit,
        });

        return games;
    }

    static async getStatistics(
        user: User | number
    ): Promise<GetStatisticsResponse> {
        if (typeof user === "number") user = await User.findById(user);

        const history = await user.getGames({
            attributes: ["winnerId"],
        });

        let wins = 0;
        let losses = 0;

        for (const game of history) {
            if (game.winnerId === user.id) wins++;
            else losses++;
        }

        const winRate = history.length
            ? Number(((wins / history.length) * 100).toFixed(2))
            : 0;

        const statistics: GetStatisticsResponse = {
            totalGames: history.length,
            wins,
            losses,
            winRate,
        };

        return statistics;
    }
}
