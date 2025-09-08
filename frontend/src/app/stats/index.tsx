import React, { useEffect, useNavigate, useState } from "react";
import FriendsApi from "@features/user/service/friendsApi";
import { TournamentDTOType, UserDTOType } from "shared/dist";
import { useStats } from "@features/user/model/useStats";
import { MatchHistory } from "@features/stats/ui/MatchHistory";
import { Charts } from "@features/stats/ui/Charts";
import { Head } from "@features/stats/ui/Head";
import { StatsCard } from "@features/stats/ui/Stats";

export default function StatsDashboard({ id }: { id?: string }) {
    const { stats, history, fetchGameHistory, fetchUserStats } = useStats();
    const [statsUser, setStatsUser] = useState<UserDTOType | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) {
            navigate("/");
            return;
        }
        let mounted = true;
        (async () => {
            try {
                const newUser = await FriendsApi.getUserByIdOrUsername(id);
                if (!mounted) return;
                fetchUserStats(id);
                fetchGameHistory(id);
                setStatsUser(newUser);
            } catch (err) {

            }
        })();
        return () => {
            mounted = false;
        };
    }, [id]);

    if (!id || !statsUser || !stats) return <div />;

    const allGames = [
        ...history.games,
        ...(history.tournaments
            ? history.tournaments.flatMap(
                  (tournament) => tournament.games || []
              )
            : []),
    ];

    return (
        <div className="text-white p-6 lg:p-12 max-h-screen overflow-auto">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <Head user={statsUser} />

                {/* Stats cards */}
                <StatsCard allStats={stats} />

                {/* Charts */}
                <Charts allStats={stats} games={allGames} user={statsUser} />

                {/* Match history */}
                <MatchHistory games={allGames} />
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
