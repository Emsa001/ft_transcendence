import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { GameDTOType, GetStatisticsResponse, UserDTOType } from "shared/dist";
import { LineChart } from "./Charts/LineChart";
import { PieChart } from "./Charts/PieChart";

function overAllScores(username: string, games: GameDTOType[]) {
    let score = 0;
    games.forEach((game) => {
        const player = game.players.find((p) => p.username === username);
        if (player) {
            score += player.score;
        }
    });
    return score;
}

function getAllGameScores(
    games: GameDTOType[],
    username: string,
    randomEvents: boolean
) {
    let score = 0;
    games.forEach((game) => {
        if (game.randomEvents === randomEvents) {
            const player = game.players.find((p) => p.username === username);
            if (player) {
                score += player.score;
            }
        }
    });
    return score;
}

interface ChartsProps {
    allStats: GetStatisticsResponse;
    games: GameDTOType[];
    user: UserDTOType;
}

export function Charts({ allStats, games, user }: ChartsProps) {
    const overAll = overAllScores(user.username, games);
    const randomEventScores = getAllGameScores(games, user.username, true);
    const casualScores = getAllGameScores(games, user.username, false);

    const stats = allStats?.total;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LineChart stats={stats} games={games} user={user} />
            <PieChart stats={stats} games={games} user={user} />
        </div>
    );
}
