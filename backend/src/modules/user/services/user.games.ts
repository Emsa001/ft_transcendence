import { Game } from "@/database/models/Game/Game";
import { GameDTO } from "@/database/models/Game/GameDTO";
import { Tournament } from "@/database/models/Tournaments/Tournament";
import { TournamentDTO } from "@/database/models/Tournaments/TournamentDTO";
import { User } from "@/database/models/User/User";
import { Op } from "sequelize";
import { GameHistoryFilter, GameStatus, GetStatisticsResponse } from "shared";

export class UserGamesService {
    static async getHistory(
        user: User | number,
        { start, end, limit = 30 }: GameHistoryFilter = {}
    ): Promise<GameDTO[]> {
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
            include: ["players"],
        });

        return games.map((game) => game.toDTO());
    }

    static async getTournaments(
        user: User | number,
        { start, end, limit = 30 }: GameHistoryFilter = {}
    ): Promise<TournamentDTO[]> {
        if (typeof user === "number") user = await User.findById(user);

        const now = new Date();
        if (!start) start = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24h ago
        if (!end) end = now;

        const tournaments = await user.getTournaments({
            where: {
                createdAt: {
                    [Op.gte]: start,
                    [Op.lte]: end,
                },
            },
            order: [["createdAt", "DESC"]],
            limit,
            include: ["players"],
        });

        return tournaments.map((tournament) => tournament.toDTO());
    }

    static async getStatistics(
        user: User | number
    ): Promise<GetStatisticsResponse> {
        if (typeof user === "number") user = await User.findById(user);

        // Get game statistics
        const gameHistory = await user.getGames({
            attributes: ["winnerId"],
            where: {
                status: GameStatus.FINISHED,
                tournamentId: null, // Only casual games
            },
        });

        let gameWins = 0;
        let gameLosses = 0;

        for (const game of gameHistory) {
            if (game.winnerId === user.id) gameWins++;
            else gameLosses++;
        }

        const gameWinRate = gameHistory.length
            ? Number(((gameWins / gameHistory.length) * 100).toFixed(2))
            : 0;

        // Get tournament statistics
        const tournamentHistory = await user.getTournaments({
            attributes: ["winnerId"],
        });

        let tournamentWins = 0;
        let tournamentLosses = 0;

        for (const tournament of tournamentHistory) {
            if (tournament.winnerId === user.id) tournamentWins++;
            else tournamentLosses++;
        }

        const tournamentWinRate = tournamentHistory.length
            ? Number(
                  ((tournamentWins / tournamentHistory.length) * 100).toFixed(2)
              )
            : 0;

        // Calculate total statistics
        const totalAmount = gameHistory.length + tournamentHistory.length;
        const totalWins = gameWins + tournamentWins;
        const totalLosses = gameLosses + tournamentLosses;
        const totalWinRate = totalAmount
            ? Number(((totalWins / totalAmount) * 100).toFixed(2))
            : 0;

        const statistics: GetStatisticsResponse = {
            casual: {
                amount: gameHistory.length,
                wins: gameWins,
                losses: gameLosses,
                winRate: gameWinRate,
            },
            tournaments: {
                amount: tournamentHistory.length,
                wins: tournamentWins,
                losses: tournamentLosses,
                winRate: tournamentWinRate,
            },
            total: {
                amount: totalAmount,
                wins: totalWins,
                losses: totalLosses,
                winRate: totalWinRate,
            },
        };

        return statistics;
    }
}
