import React, { useEffect, useNavigate, useState } from "react";
import { FaBan } from "react-icons/fa";
import { Stats } from "@features/profile/ui/Stats";
import {
    PlayerGameHistory,
    PlayerTournamentHistory,
} from "@features/user/ui/PlayerGameHistory";
import { UserDTOType } from "shared";
import { Icon } from "@shared/components/Icon";
import { UserInfoDisplay } from "@features/user/ui/UserInfoDisplay";
import { UserInfo } from "@features/user/ui/UserInfo";
import { useUser } from "@features/auth/model/useUser";
import { useStats } from "@features/user/model/useStats";

import blockUserApi from "@features/user/service/blockUserApi";
import FriendsApi from "@features/user/service/friendsApi";

export default function User({ username }: { username?: string }) {
    const navigate = useNavigate();
    const { user } = useUser();
    const [profileUser, setProfileUser] = useState<UserDTOType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isBlocked, setIsBlocked] = useState(false);

    const { history, stats, fetchGameHistory, fetchUserStats } = useStats();

    useEffect(() => {
        if (profileUser) {
            fetchGameHistory(profileUser.id);
            fetchUserStats(profileUser.id);
        }
    }, [profileUser]);

    useEffect(() => {
        if (!username) return;

        const fetchUser = async () => {
            try {
                setLoading(true);
                setError(null);
                const newUser =
                    await FriendsApi.getUserByIdOrUsername(username);
                setProfileUser(newUser);
            } catch (err) {
                setError("Failed to load user profile");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [username]);

    useEffect(() => {
        if (user && profileUser && user.id === profileUser.id) {
            navigate("/profile");
        }
    }, [user, profileUser]);

    useEffect(() => {
        const checkBlockedStatus = async () => {
            if (profileUser) {
                try {
                    const blocked = await blockUserApi.amIBlockedByUser(
                        profileUser.id
                    );

                    setIsBlocked(blocked);
                } catch (error) {}
            }
        };

        if (profileUser) {
            checkBlockedStatus();
        }
    }, [profileUser]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-black via-zinc-900 to-black">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-white text-xl">
                        Loading user profile...
                    </div>
                </div>
            </div>
        );
    }

    if (error || !profileUser) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-black via-zinc-900 to-black">
                <section className="max-w-md w-full backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-red-500/20 text-center">
                    <Icon
                        icon={FaBan}
                        className="text-red-400 w-16 h-16 mx-auto mb-4"
                    />
                    <h1 className="text-2xl font-bold text-red-400 mb-2">
                        Error
                    </h1>
                    <p className="text-gray-300 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </section>
            </div>
        );
    }

    if (isBlocked) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-black via-zinc-900 to-black">
                <section className="max-w-md w-full backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-red-500/20 text-center">
                    <Icon
                        icon={FaBan}
                        className="text-red-400 w-16 h-16 mx-auto mb-4"
                    />
                    <h1 className="text-2xl font-bold text-red-400 mb-2">
                        User Blocked
                    </h1>
                    <p className="text-gray-300 mb-4">
                        You have been blocked from viewing this profile.
                    </p>
                    <button
                        onClick={() => navigate("/home")}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                        Home
                    </button>
                </section>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col lg:items-center lg:justify-center pt-20 pb-10 z-10 relative overflow-y-auto ">
            <div className=" text-gray-100 px-4 w-full max-w-7xl">
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg w-full md:w-1/3 flex items-center justify-center">
                        <UserInfoDisplay user={profileUser} />
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg w-full md:w-2/3 ">
                        <UserInfo user={profileUser} />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg w-full md:w-1/3 flex flex-col">
                        <Stats stats={stats} />
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 w-full md:w-2/3">
                        <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg w-full md:w-1/2 flex flex-col">
                            <PlayerGameHistory games={history?.games || []} />
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg w-full md:w-1/2 flex flex-col">
                            <PlayerTournamentHistory
                                tournaments={history?.tournaments || []}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
