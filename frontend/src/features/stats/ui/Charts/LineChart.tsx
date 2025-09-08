import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { GameDTOType, GetStatisticsResponse, UserDTOType } from "shared/dist";
import { useLanguage } from "@features/language/model/useLanguage";

const LINE_CHART_BASE = {
    type: "line" as const,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom" as const,
                labels: {
                    color: "#d6c6f1",
                },
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        return `${context.dataset.label}: ${context.formattedValue}`;
                    },
                },
            },
        },
        scales: {
            y: {
                ticks: {
                    color: "#d6c6f1",
                },
                grid: {
                    color: "rgba(255,255,255,0.1)",
                },
            },
            x: {
                ticks: {
                    color: "#d6c6f1",
                },
                grid: {
                    display: false,
                },
            },
        },
    },
};

function getUserScores(username: string, games: GameDTOType[]) {
    return games.map((game) => {
        const player = game.players.find((p) => p.username === username);
        return player ? player.score : 0;
    });
}

function getAverageScores(games: GameDTOType[]) {
    return games.map((game) => {
        const totalScore = game.players.reduce((sum, p) => sum + p.score, 0);
        return Math.round(totalScore / game.players.length);
    });
}

interface LineChartProps {
    stats: GetStatisticsResponse["total"];
    games: GameDTOType[];
    user: UserDTOType;
}

export function LineChart({ games, user }: LineChartProps) {
    const lineChartRef = useRef<HTMLCanvasElement | null>(null);
    const lineChartInstance = useRef<Chart | null>(null);
    const { getText } = useLanguage();
    const text = getText("charts");

    useEffect(() => {
        if (!lineChartRef.current) return;

        const ctx = lineChartRef.current.getContext("2d");
        if (ctx) {
            const recentGames = [...games]
                .sort(
                    (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                )
                .slice(-10);
            const userScores = getUserScores(user.username, recentGames);
            const avgScores = getAverageScores(recentGames);

            lineChartInstance.current = new Chart(ctx, {
                ...LINE_CHART_BASE,
                data: {
                    labels: recentGames.map((g) => `#${g.id}`),
                    datasets: [
                        {
                            label: text.yourScore,
                            data: userScores,
                            borderColor: "#ff6ab9",
                            backgroundColor: "rgba(255,106,185,0.3)",
                            tension: 0.4,
                            fill: true,
                            pointRadius: 5,
                            pointHoverRadius: 7,
                        },
                        {
                            label: text.averageScore,
                            data: avgScores,
                            borderColor: "#a259ff",
                            backgroundColor: "rgba(162,89,255,0.2)",
                            tension: 0.3,
                            fill: false,
                            borderDash: [5, 5],
                        },
                    ],
                },
            });
        }
        return () => {
            if (lineChartInstance.current) {
                lineChartInstance.current.destroy();
            }
        };
    }, [games, user, text]);

    return (
        <div className="glass-panel p-4 rounded-2xl">
            <h2 className="mb-10 font-semibold text-white">
                {text.scoreProgression}
            </h2>
            <div
                className="chart-container"
                style={{ position: "relative", height: "300px" }}
            >
                <canvas ref={lineChartRef}></canvas>
            </div>
        </div>
    );
}
