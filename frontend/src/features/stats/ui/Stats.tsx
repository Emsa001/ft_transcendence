import React from "react";
import { Icon } from "@shared/components/Icon";
import { GetStatisticsResponse } from "shared/dist";
import { MdOutlineGames } from "react-icons/md";
import { FaAward } from "react-icons/fa";
import { IoMdSad } from "react-icons/io";

export function StatsCard({ allStats }: { allStats: GetStatisticsResponse }) {
    const stats = allStats.total;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 shadow-md text-xl">
                    <Icon
                        icon={MdOutlineGames}
                        className="text-white w-8 h-8"
                    />
                </div>
                <div>
                    <div className="text-xs text-purple-200">Games</div>
                    <div className="text-2xl font-bold">{stats.amount}</div>
                </div>
            </div>
            <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 shadow-md text-xl">
                    <Icon icon={FaAward} className="text-white w-8 h-8" />
                </div>
                <div>
                    <div className="text-xs text-purple-200">wins</div>
                    <div className="text-2xl font-bold">{stats.wins}</div>
                </div>
            </div>
            <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 shadow-md text-xl">
                    <Icon icon={IoMdSad} className="text-white w-8 h-8" />
                </div>
                <div>
                    <div className="text-xs text-purple-200">Losses</div>
                    <div className="text-2xl font-bold">{stats.losses}</div>
                </div>
            </div>
        </div>
    );
}
