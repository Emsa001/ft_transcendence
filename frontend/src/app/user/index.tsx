import React, { useEffect, useState } from "react";
import { useUser } from "@features/auth/model/useUser";
import { FaEdit, FaUser, FaUserCircle, FaUsers, FaComments, FaBan } from "react-icons/fa";
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
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!username) return;

        const fetchUser = async () => {
            try {
                setLoading(true);
                setError(null);
                const newUser = await ProfileApi.getUserByIdOrUsername(username);
                setUser(newUser);
            } catch (err) {
                setError("Failed to load user profile");
                console.error("Error fetching user:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [username]);

    if (loading) {	
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-black via-zinc-900 to-black">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-white text-xl">Loading user profile...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-black via-zinc-900 to-black">
                <section className="max-w-md w-full backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-red-500/20 text-center">
                    <Icon icon={FaBan} className="text-red-400 w-16 h-16 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-red-400 mb-2">Error</h1>
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

    return (
        <div className="bg-gradient-to-b from-black via-zinc-900 to-black pt-20">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 -right-32 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 pb-8 max-w-6xl">
                {user ? (
                    <>
                        {/* User Header Card */}
                        <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10 mb-8">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                {/* Profile Picture */}
                                <div className="flex-shrink-0">
                                    <OtherUserPicture userId={user.id} />
                                </div>

                                {/* User Info */}
                                <div className="flex-grow text-center md:text-left">
                                    <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 mb-2">
                                        {user.username}
                                    </h1>
                                    <p className="text-gray-400 mb-4">
                                        Player ID: #{user.id}
                                    </p>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                                        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                                            <Icon icon={FaComments} className="w-4 h-4" />
                                            Send Message
                                        </button>
                                        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                                            <Icon icon={FaUsers} className="w-4 h-4" />
                                            Add Friend
                                        </button>
                                        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                                            <Icon icon={FaBan} className="w-4 h-4" />
                                            Block User
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            {/* User Stats */}
                            <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10 h-fit">
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 flex items-center gap-3">
                                    <Icon icon={FaUser} className="w-6 h-6 md:w-8 md:h-8 text-indigo-400" />
                                    Player Statistics
                                </h2>
                                <UserStats userId={user.id} />
                            </div>

                            {/* Game History */}
                            <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10 h-fit">
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 flex items-center gap-3">
                                    <Icon icon={FaUsers} className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
                                    Recent Games
                                </h2>
                                <GameHistory userId={user.id} />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <section className="max-w-md w-full backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 text-center">
                            <Icon icon={FaUserCircle} className="text-gray-400 w-24 h-24 mx-auto mb-6 opacity-50" />
                            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 mb-4">
                                User Not Found
                            </h1>
                            <p className="text-gray-400 mb-6">
                                The user you're looking for doesn't exist or has been removed.
                            </p>
                            <button 
                                onClick={() => window.history.back()}
                                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
                            >
                                Go Back
                            </button>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}
