import { useState } from "react";
import { GameDTOType, GetStatisticsResponse } from "shared";
import StatsApi from "../service/api";

export const useStats = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchGameHistory = async (
        userId: string | number
    ): Promise<GameDTOType[] | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await StatsApi.getUserGameHistory(userId);
            return response;
        } catch (err) {
            console.error("Error fetching game history:", err);
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
        loading,
        error,
    };
};
