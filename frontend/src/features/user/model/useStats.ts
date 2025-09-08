import { useState } from "react";
import { GameHistory, GetStatisticsResponse } from "shared";
import StatsApi from "../service/api";

export const useStats = () => {
    const [history, setHistory] = useState<GameHistory>({
        games: [],
        tournaments: [],
    });
    const [stats, setStats] = useState<GetStatisticsResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchGameHistory = async (
        userId: string | number
    ): Promise<GameHistory | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await StatsApi.getUserGameHistory(userId);
            setHistory(response);
            return response;
        } catch (err) {

            setError("An error occurred while fetching game history.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const fetchUserStats = async (
        userId: string | number
    ): Promise<GetStatisticsResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await StatsApi.getUserStats(userId);
            setStats(response);
            return response;
        } catch (err) {
            setError("An error occurred while fetching user stats.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        fetchGameHistory,
        fetchUserStats,
        history,
        stats,
        loading,
        error,
    };
};
