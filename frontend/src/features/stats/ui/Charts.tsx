import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { GameDTOType, GetStatisticsResponse, UserDTOType } from "shared/dist";

const CHART_CONFIG = {
    LINE_CHART: {
        type: "line" as const,
        data: {
            labels: [] as string[],
            datasets: [
                {
                    label: "Wins (1) / Losses (0)",
                    data: [] as number[],
                    borderColor: "#ff6ab9",
                    backgroundColor: "rgba(255, 106, 185, 0.3)",
                    tension: 0.4,
                    fill: true,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                y: {
                    min: 0,
                    max: 1,
                    ticks: {
                        stepSize: 1,
                        color: "#d6c6f1",
                    },
                },
                x: {
                    ticks: {
                        color: "#d6c6f1",
                    },
                },
            },
        },
    },
    PIE_CHART: {
        type: "doughnut" as const,
        data: {
            labels: ["Wins", "Losses"],
            datasets: [
                {
                    data: [0, 0],
                    backgroundColor: ["#ff6ab9", "#a259ff"],
                    borderWidth: 1,
                    borderColor: "#2a2045",
                },
            ],
        },
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
    },
};

interface ChartsProps {
    allStats: GetStatisticsResponse;
    games: GameDTOType[];
    user: UserDTOType;
}

export function Charts({ allStats, games, user }: ChartsProps) {
    const lineChartRef = useRef<HTMLCanvasElement | null>(null);
    const pieChartRef = useRef<HTMLCanvasElement | null>(null);
    const lineChartInstance = useRef<Chart | null>(null);
    const pieChartInstance = useRef<Chart | null>(null);

    const stats = allStats?.total;

    useEffect(() => {
        if (!stats || !games.length) return;

        if (lineChartInstance.current) {
            lineChartInstance.current.destroy();
        }
        if (pieChartInstance.current) {
            pieChartInstance.current.destroy();
        }

        if (lineChartRef.current) {
            const ctx = lineChartRef.current.getContext("2d");
            if (ctx) {
                const recentGames = games.slice(-10);

                lineChartInstance.current = new Chart(ctx, {
                    ...CHART_CONFIG.LINE_CHART,
                    data: {
                        ...CHART_CONFIG.LINE_CHART.data,
                        labels: recentGames.map((g) => `#${g.id}`),
                        datasets: [
                            {
                                ...CHART_CONFIG.LINE_CHART.data.datasets[0],
                                data: recentGames.map((g) =>
                                    g.winner &&
                                    user &&
                                    g.winner === user.username
                                        ? 1
                                        : 0
                                ),
                            },
                        ],
                    },
                });
            }
        }

        if (pieChartRef.current) {
            const ctx = pieChartRef.current.getContext("2d");
            if (ctx) {
                pieChartInstance.current = new Chart(ctx, {
                    ...CHART_CONFIG.PIE_CHART,
                    data: {
                        ...CHART_CONFIG.PIE_CHART.data,
                        datasets: [
                            {
                                ...CHART_CONFIG.PIE_CHART.data.datasets[0],
                                data: [stats.wins, stats.losses],
                            },
                        ],
                    },
                });
            }
        }

        // Cleanup function to destroy chart instances on component unmount
        return () => {
            if (lineChartInstance.current) {
                lineChartInstance.current.destroy();
            }
            if (pieChartInstance.current) {
                pieChartInstance.current.destroy();
            }
        };
    }, [stats, games, user]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-4 rounded-2xl">
                <h2 className="mb-3 font-semibold text-white">
                    Recent Matches (Wins/Losses)
                </h2>
                <div
                    className="chart-container"
                    style={{ position: "relative", height: "300px" }}
                >
                    <canvas ref={lineChartRef}></canvas>
                </div>
            </div>
            <div className="glass-panel p-4 rounded-2xl">
                <h2 className="mb-3 font-semibold text-white">
                    Win / Loss Ratio
                </h2>
                <div
                    className="chart-container"
                    style={{ position: "relative", height: "300px" }}
                >
                    <canvas ref={pieChartRef}></canvas>
                </div>
            </div>
        </div>
    );
}
