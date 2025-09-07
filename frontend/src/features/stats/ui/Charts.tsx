import React, { useEffect, useRef } from "react";
import { GameDTOType, GetStatisticsResponse, UserDTOType } from "shared/dist";
import { LineChart } from "./Charts/LineChart";
import { PieChart } from "./Charts/PieChart";

interface ChartsProps {
    allStats: GetStatisticsResponse;
    games: GameDTOType[];
    user: UserDTOType;
}

export function Charts({ allStats, games, user }: ChartsProps) {
    const stats = allStats?.total;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LineChart stats={stats} games={games} user={user} />
            <PieChart stats={stats} games={games} user={user} />
        </div>
    );
}
