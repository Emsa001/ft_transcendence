import React, { useEffect, useNavigate, useState } from "react";
import { ContactInfo } from "@features/profile/ui/ContactInfo";
import { UserInfo } from "@features/profile/ui/UserInfo";
import { Stats } from "@features/profile/ui/Stats";
import { Friends } from "@features/profile/ui/friends/Friends";
import { useUser } from "@features/auth/model/useUser";
import {
    PlayerGameHistory,
    PlayerTournamentHistory,
} from "@features/user/ui/PlayerGameHistory";
import { useStats } from "@features/user/model/useStats";

export const Profile = () => {
    const { user, loading } = useUser();
    const { history, stats, fetchGameHistory, fetchUserStats } = useStats();
    const [showHistory, setShowHistory] = useState<"games" | "tournaments">(
        "games"
    );

    useEffect(() => {
        if (user) {
            fetchGameHistory(user.id);
            fetchUserStats(user.id);
        }
    }, [user]);

    const navigate = useNavigate();

    useEffect(() => {
        if (!user && !loading) navigate("/auth");
    }, [user, loading]);

    if (!user) return <div />;

    return (
        <div className="w-full h-full flex flex-col lg:items-center lg:justify-center pt-20 pb-10 z-10 relative overflow-y-auto ">
            <div className=" text-gray-100 px-4  w-full max-w-7xl">
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg w-full md:w-1/3 flex items-center justify-center">
                        <UserInfo />
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg w-full md:w-2/3 ">
                        <ContactInfo />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg w-full md:w-1/3 flex flex-col">
                        <Stats stats={stats} />
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 w-full md:w-2/3">
                        <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg w-full md:w-1/2 flex flex-col">
                            <Friends />
                        </div>
                        <div className="relative bg-gray-800/50 rounded-lg p-6 shadow-lg w-full md:w-1/2 flex flex-col">
                            <button
                                className="absolute right-6 px-3 py-1 rounded bg-gray-700/50 text-white hover:bg-gray-600 transition"
                                onClick={() =>
                                    setShowHistory(
                                        showHistory === "games"
                                            ? "tournaments"
                                            : "games"
                                    )
                                }
                            >
                                Switch
                            </button>
                            {showHistory === "games" ? (
                                <PlayerGameHistory
                                    games={history?.games || []}
                                />
                            ) : (
                                <PlayerTournamentHistory
                                    tournaments={history?.tournaments || []}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
