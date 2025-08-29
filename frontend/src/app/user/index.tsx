import React, { useEffect, useNavigate, useState } from "react";
import {
    LogoutButton,
    TwoFactorAuthDisable,
    TwoFactorAuthEnable,
} from "@features/auth";
import { useUser } from "@features/auth/model/useUser";
import { FaEdit, FaUser, FaUserCircle, FaUsers, FaComments, FaBan } from "react-icons/fa";
import Friends from "../../features/friends/friends";
import { UserStats } from "@features/user/ui/UserStats";
import { GameHistory } from "@features/user/ui/GameHistory";
import { UserPicture } from "@features/user/ui/UserPicture";
import ProfileApi from "@features/user/service/profileApi";
import { DeleteButton } from "@features/user/ui/Delete";
import { AllUsers } from "@features/user/ui/AllUsers";
import FriendsApi from "@features/user/service/friendsApi";
import { UserDTOType } from "shared";
import { Icon } from "@shared/components/Icon";
import { OtherUserPicture } from "@features/user/ui/UserPicture";

export default function User({ username }: { username?: string }) {
    const [user, setUser] = useState<UserDTOType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!username) return;

        const fetchUser = async () => {
            setLoading(true);
            const newUser = await ProfileApi.getUserByIdOrUsername(username);
            setUser(newUser);
            setLoading(false);
        };
        fetchUser();
    }, [username]);

    if (loading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center px-4">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="w-screen h-screen flex items-center justify-center px-4">
            {user ? (
                <section className="max-w-4xl w-full backdrop-blur-2xl bg-gradient-to-br from-transparent to-black/30 rounded-3xl p-10 shadow-2xl relative z-10">
                    {/* User Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div>
                        < OtherUserPicture userId={user.id}/>
                        </div>
                        <h1 className="text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 mb-2">
                            {user.username}
                        </h1>
                        
                        <p className="text-center text-gray-400 mb-6">
                            Player ID: #{user.id}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-4 mb-8">
                            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                                Chat
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                                Block
                            </button>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* User Stats */}
                        <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10">
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <Icon icon={FaUser} className="w-5 h-5 text-indigo-400" />
                                Statistics
                            </h2>
                            <UserStats userId={user.id} />
                        </div>

                        {/* Game History */}
                        <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10">
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <Icon icon={FaUsers} className="w-5 h-5 text-purple-400" />
                                Game History
                            </h2>
                            <GameHistory userId={user.id} />
                        </div>
                    </div>
                </section>
            ) : (
                <section className="max-w-lg w-full backdrop-blur-2xl bg-gradient-to-br from-transparent to-black/30 rounded-3xl p-10 shadow-2xl relative z-10 text-center">
                    <h1 className="text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 mb-2">
                        User Not Found
                    </h1>
                    <p className="text-center text-gray-400 mb-8">
                        The user you're looking for doesn't exist or has been removed.
                    </p>
                    <Icon icon={FaUserCircle} className="text-gray-400 w-32 h-32 mx-auto opacity-50" />
                </section>
            )}
        </div>
    );
}
