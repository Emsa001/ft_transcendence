import React from "react";
import { useLanguage } from "@features/language/model/useLanguage";
import { GetStatisticsResponse } from "shared";

interface StatsProps {
    stats: GetStatisticsResponse | null;
}

export const Stats = ({ stats }: StatsProps) => {
    const { getText } = useLanguage();
    const texts = getText("profile.stats");

    if (!stats) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-gray-300 text-center">{texts.noStats}</div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
                {texts.title}
            </h2>
            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <span className="font-semibold">{texts.totalGames}</span>
                    <span className="text-indigo-400 font-bold">
                        {stats.total.amount}
                    </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <span className="font-semibold">{texts.wins}</span>
                    <span className="text-green-400 font-bold">
                        {stats.total.wins}
                    </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <span className="font-semibold">{texts.losses}</span>
                    <span className="text-red-400 font-bold">
                        {stats.total.losses}
                    </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <span className="font-semibold">{texts.winRate}</span>
                    <span className="text-yellow-400 font-bold">
                        {stats.total.winRate.toFixed(1)}%
                    </span>
                </div>
            </div>
        </div>
    );
};
