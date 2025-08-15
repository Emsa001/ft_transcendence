import { useState } from "react";
import { GameDTOType } from "shared";
import StatsApi from "../service/api";

export const useStats = () => {
    const [gameHistory, setGameHistory] = useState<GameDTOType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchGameHistory = async (userId: string | number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await StatsApi.getUserGameHistory(userId);
            setGameHistory(response);
        } catch (err) {
            console.error("Error fetching game history:", err);
            setError("An error occurred while fetching game history.");
        } finally {
            setLoading(false);
        }
    };

    return {
        fetchGameHistory,
        gameHistory,
        loading,
        error,
    };
};
