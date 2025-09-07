import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { GameDTOType, GetStatisticsResponse, UserDTOType } from "shared/dist";

const PIE_CHART_BASE = {
    type: "doughnut" as const,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom" as const,
                labels: {
                    color: "#d6c6f1",
                    font: {
                        size: 12,
                    },
                },
            },
        },
        cutout: "60%",
    },
};

const DATA = (wins: number, losses: number) => ({
    labels: ["Wins", "Losses"],
    datasets: [
        {
            data: [wins, losses],
            backgroundColor: ["#a259ff", "#ff6ab9"],
            borderWidth: 1,
            borderColor: "#2a2045",
        },
    ],
});

const NO_DATA = {
    labels: ["No Data"],
    datasets: [
        {
            data: [1],
            backgroundColor: ["#888888"],
            borderWidth: 1,
            borderColor: "#2a2045",
        },
    ],
};

function getAllGamesCount(
    games: GameDTOType[],
    username: string,
    randomEvents: boolean,
    wins: boolean
) {
    let count = 0;
    games.forEach((game) => {
        if (game.randomEvents === randomEvents) {
            const player1 = game.players.find((p) => p.username === username);
            if (player1) {
                if (wins) {
                    if (game.winner === username) {
                        count++;
                    }
                } else {
                    if (game.winner !== username) {
                        count++;
                    }
                }
            }
        }
    });
    return count;
}

interface PieChartProps {
    stats: GetStatisticsResponse["total"];
    games: GameDTOType[];
    user: UserDTOType;
}

export function PieChart({ stats, games, user }: PieChartProps) {
    const overallChartRef = useRef<HTMLCanvasElement | null>(null);
    const casualChartRef = useRef<HTMLCanvasElement | null>(null);
    const randomChartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstances = useRef<Chart[]>([]);

    useEffect(() => {
        // Destroy old charts on cleanup before creating new ones
        chartInstances.current.forEach((chart) => chart.destroy());
        chartInstances.current = [];

        function createChart(
            ref: HTMLCanvasElement | null,
            wins: number,
            losses: number,
            empty: boolean
        ) {
            if (!ref) return;
            const ctx = ref.getContext("2d");
            if (!ctx) return;

            const chart = new Chart(ctx, {
                ...PIE_CHART_BASE,
                data: empty ? NO_DATA : DATA(wins, losses),
            });
            chartInstances.current.push(chart);
        }

        // Overall chart
        let empty = false;
        if (!stats.losses && !stats.wins) empty = true;
        else empty = false;
        createChart(overallChartRef.current, stats.wins, stats.losses, empty);

        // Casual games
        const casualWinCount = getAllGamesCount(
            games,
            user.username,
            false,
            true
        );
        const casualLossCount = getAllGamesCount(
            games,
            user.username,
            false,
            false
        );

        if (!casualWinCount && !casualLossCount) empty = true;
        else empty = false;

        createChart(
            casualChartRef.current,
            casualWinCount,
            casualLossCount,
            empty
        );

        // Random event games

        const randomWinCount = getAllGamesCount(
            games,
            user.username,
            true,
            true
        );
        const randomLossCount = getAllGamesCount(
            games,
            user.username,
            true,
            false
        );
        if (!randomWinCount && !randomLossCount) empty = true;
        else empty = false;
        createChart(
            randomChartRef.current,
            randomWinCount,
            randomLossCount,
            empty
        );

        return () => {
            chartInstances.current.forEach((chart) => chart.destroy());
            chartInstances.current = [];
        };
    }, [stats, games]);

    return (
        <div className="glass-panel p-4 rounded-2xl">
            <h2 className="mb-3 font-semibold text-white">Win / Loss Ratio</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Big overall chart */}
                <div
                    className="col-span-2 chart-container"
                    style={{ position: "relative", height: "200px" }}
                >
                    <canvas ref={overallChartRef}></canvas>
                </div>

                {/* Casual chart */}
                <div
                    className="chart-container"
                    style={{ position: "relative", height: "100px" }}
                >
                    <h3 className="text-center text-sm text-white mb-2">
                        Casual
                    </h3>
                    <canvas ref={casualChartRef}></canvas>
                </div>

                {/* Random Event chart */}
                <div
                    className="chart-container"
                    style={{ position: "relative", height: "100px" }}
                >
                    <h3 className="text-center text-sm text-white mb-2">
                        Random Events
                    </h3>
                    <canvas ref={randomChartRef}></canvas>
                </div>
            </div>
        </div>
    );
}
