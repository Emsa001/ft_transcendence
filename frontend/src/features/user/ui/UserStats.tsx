import React, { useEffect, useState } from "react";
import { useStats } from "../model/useStats";
import { GetStatisticsResponse } from "shared";

export const UserStats = ({ userId }: { userId: string | number }) => {
    const { fetchUserStats, loading, error } = useStats();
    const [stats, setStats] = useState<GetStatisticsResponse | null>(null);

    useEffect(() => {
        if (userId) {
            fetchUserStats(userId).then((data) => {
                if (data) {
                    setStats(data);
                } else {
                    console.error("Failed to fetch user stats");
                }
            });
        }
    }, [userId]);

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-white animate-pulse">Loading stats...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-red-400 text-center">
                    Failed to load stats. Please try again later.
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-gray-300 text-center">
                    No stats available for this user.
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 rounded-lg bg-purple-600/10 backdrop-blur-md border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-10 text-center">
                Player Statistics
            </h2>

            <div className="grid grid-cols-2 gap-4">
                <StatCard label="Total Games" value={stats.total.amount} />
                <StatCard label="Wins" value={stats.total.wins} />
                <StatCard label="Losses" value={stats.total.losses} />
                <StatCard
                    label="Win Rate"
                    value={`${stats.total.winRate.toFixed(1)}%`}
                />
            </div>
        </div>
    );
};

const StatCard = ({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) => (
    <div className="p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
        <div className="text-2xl font-bold text-white mb-2">{value}</div>
        <div className="text-sm text-white/70">{label}</div>
    </div>
);
