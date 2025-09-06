import React, { useEffect, useState, useRef } from "react";
import { FiUsers, FiAward, FiClock, FiStar } from "react-icons/fi";
import { RiGamepadLine } from "react-icons/ri";
import Chart from "chart.js/auto";
import StatsApi from "@features/stats/service/api";
import FriendsApi from "@features/user/service/friendsApi";
import { UserDTOType } from "shared/dist";
import { Icon } from "@shared/components/Icon";

interface Game {
    id: number;
    status: "waiting" | "finished";
    mode: "normal" | "casual" | "tournament";
    isPrivate: boolean;
    maxScore: number;
    players: UserDTOType[];
    maxPlayers: number;
    winner: string | null;
    createdAt: string;
    updatedAt: string;
}

interface Statistic {
    amount: number;
    wins: number;
    losses: number;
    winRate: number;
}

const formatDate = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleString();
};

function StatCard({
    icon,
    title,
    value,
}: {
    icon: ReactNode;
    title: string;
    value: number | string;
}) {
    return (
        <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 shadow-md text-xl">
                {icon}
            </div>
            <div>
                <div className="text-xs text-purple-200">{title}</div>
                <div className="text-2xl font-bold">{value}</div>
            </div>
        </div>
    );
}

export default function StatsDashboard({ id }: { id?: string }) {
    const userId = id ? parseInt(id, 10) : null;
    const [stats, setStats] = useState<Statistic | null>(null);
    const [games, setGames] = useState<Game[]>([]);
    const [user, setUser] = useState<UserDTOType | null>(null);
    const [loading, setLoading] = useState(false);

    const lineChartRef = useRef<HTMLCanvasElement | null>(null);
    const pieChartRef = useRef<HTMLCanvasElement | null>(null);

    if (!id) return null;

    useEffect(() => {
        if (!userId) return;
        let mounted = true;
        setLoading(true);
        (async () => {
            try {
                const [s, g, u] = await Promise.all([
                    StatsApi.getUserStats(userId),
                    StatsApi.getUserGameHistory(userId),
                    FriendsApi.getUserByIdOrUsername(id),
                ]);
                if (!mounted) return;
                setStats(s || null);
                setGames(g || []);
                setUser(u || null);
            } catch (err) {
                console.error(err);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [userId]);

    useEffect(() => {
        if (!stats || !games.length) return;

        // destroy existing charts if re-rendered
        if (lineChartRef.current) {
            const ctx = lineChartRef.current.getContext("2d");
            if (ctx) {
                new Chart(ctx, {
                    type: "line",
                    data: {
                        labels: games.slice(-10).map((g) => `#${g.id}`),
                        datasets: [
                            {
                                label: "Wins (1) / Losses (0)",
                                data: games
                                    .slice(-10)
                                    .map((g) =>
                                        g.winner &&
                                        user &&
                                        g.winner === user.username
                                            ? 1
                                            : 0
                                    ),
                                borderColor: "#ff6ab9",
                                backgroundColor: "rgba(255,106,185,0.3)",
                                tension: 0.4,
                                fill: true,
                            },
                        ],
                    },
                    options: {
                        plugins: { legend: { display: false } },
                        scales: { y: { min: 0, max: 1 } },
                    },
                });
            }
        }

        if (pieChartRef.current) {
            const ctx = pieChartRef.current.getContext("2d");
            if (ctx) {
                new Chart(ctx, {
                    type: "doughnut",
                    data: {
                        labels: ["Wins", "Losses"],
                        datasets: [
                            {
                                data: [stats.wins, stats.losses],
                                backgroundColor: ["#ff6ab9", "#a259ff"],
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        plugins: {
                            legend: {
                                position: "bottom",
                                labels: { color: "#d6c6f1" },
                            },
                        },
                    },
                });
            }
        }
    }, [stats, games, user]);

    return (
        <div className="text-white overflow-auto mt-16 p-6 lg:p-12 max-h-screen overflow-auto">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-xl glass-border">
                        <span className="text-xl font-bold">
                            {user?.username?.[0]?.toUpperCase() ?? "U"}
                        </span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">
                            {user?.username ?? "Unknown Player"}
                        </h1>
                        <p className="text-sm text-purple-200">
                            Transcendence • "Player"
                        </p>
                    </div>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 shadow-md text-xl">
                            <Icon icon={FiAward} />
                        </div>
                        <div>
                            <div className="text-xs text-purple-200">wins</div>
                            <div className="text-2xl font-bold">
                                {stats?.wins}
                            </div>
                        </div>
                    </div>
                    <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 shadow-md text-xl">
                            <Icon icon={FiUsers} />
                        </div>
                        <div>
                            <div className="text-xs text-purple-200">Games</div>
                            <div className="text-2xl font-bold">
                                {stats?.amount}
                            </div>
                        </div>
                    </div>
                    <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 shadow-md text-xl">
                            <Icon icon={RiGamepadLine} />
                        </div>
                        <div>
                            <div className="text-xs text-purple-200">
                                Losses
                            </div>
                            <div className="text-2xl font-bold">
                                {stats?.losses}%
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel p-4 rounded-2xl">
                        <h2 className="mb-3 font-semibold">
                            Recent Matches (Wins/Losses)
                        </h2>
                        <canvas ref={lineChartRef}></canvas>
                    </div>
                    <div className="glass-panel p-4 rounded-2xl">
                        <h2 className="mb-3 font-semibold">Win / Loss Ratio</h2>
                        <canvas ref={pieChartRef}></canvas>
                    </div>
                </div>

                {/* Match history */}
                <div className="glass-panel p-4 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-4">
                        Match History
                    </h3>
                    <div className="divide-y divide-purple-800">
                        {games.map((g) => (
                            <div
                                key={g.id}
                                className="py-3 px-2 flex items-center justify-between hover:bg-white/5 rounded-md transition"
                            >
                                <div>
                                    <div className="font-semibold">
                                        #{g.id} • {g.mode.toUpperCase()}
                                    </div>
                                    <div className="text-xs text-purple-200">
                                        {formatDate(g.createdAt)}
                                    </div>
                                </div>
                                <div className="text-sm">
                                    Winner:{" "}
                                    <span className="font-bold">
                                        {g.winner ?? "-"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .glass-panel {
                    background: linear-gradient(
                        135deg,
                        rgba(255, 255, 255, 0.03),
                        rgba(255, 255, 255, 0.02)
                    );
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    backdrop-filter: blur(8px) saturate(140%);
                    box-shadow: 0 6px 20px rgba(4, 6, 23, 0.6);
                }
                .glass-border {
                    border: 1px solid rgba(255, 255, 255, 0.06);
                }
            `}</style>
        </div>
    );
}
