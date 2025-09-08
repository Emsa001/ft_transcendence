import React, { useEffect, useState } from "react";
import { useStats } from "../model/useStats";
import { GetStatisticsResponse } from "shared";
import { Icon } from "@shared/components/Icon";
import { FaChartLine } from "react-icons/fa";

export const UserStats = ({ userId }: { userId: string | number }) => {
    const { fetchUserStats, loading, error } = useStats();
    const [stats, setStats] = useState<GetStatisticsResponse | null>(null);

    useEffect(() => {
        if (userId) {
            fetchUserStats(userId).then((data) => {
                if (data) {
                    setStats(data);
                } else {
                }
            });
        }
    }, [userId]);

    if (loading) {
        return (
            <div className="w-full p-6 md:p-8 min-h-[250px] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-white/80 animate-pulse">
                        Loading player stats...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-6 md:p-8 min-h-[250px] flex items-center justify-center">
                <div className="text-center bg-red-500/10 p-6 rounded-xl border border-red-500/20">
                    <Icon
                        icon={FaChartLine}
                        className="text-red-400 w-12 h-12 mx-auto mb-3 opacity-60"
                    />
                    <div className="text-red-400 font-medium mb-2">
                        Stats Unavailable
                    </div>
                    <div className="text-red-300/70 text-sm">
                        Failed to load player statistics
                    </div>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="w-full p-8 min-h-[200px] flex items-center justify-center">
                <div className="text-gray-300 text-center">
                    No stats available for this user.
                </div>
            </div>
        );
    }

    return (
        <div className="w-full p-6 rounded-lg bg-purple-600/10 backdrop-blur-md border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Player Statistics
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
