import React, { useEffect, useNavigate, useState } from "react";
import {
    LogoutButton,
    TwoFactorAuthDisable,
    TwoFactorAuthEnable,
} from "@features/auth";
import { useUser } from "@features/auth/model/useUser";
import { FaEdit, FaUser, FaUsers } from "react-icons/fa";
import Friends from "./friends";
import { ProfileCard } from "./profile";

import { UserStats } from "@features/user/ui/UserStats";
import { GameHistory } from "@features/user/ui/GameHistory";
import { UserPicture } from "@features/user/ui/UserPicture";
import ProfileApi from "@features/user/service/profileApi";
import { DeleteButton } from "@features/user/ui/Delete";
import { AllUsers } from "@features/user/ui/AllUsers";

export const Profile = () => {
    // Just for test - get user ID from URL query params to see their stats
    const query = new URLSearchParams(window.location.search);
    const userId = query.get("id");
    const [edit, setEdit] = useState(false);

    const { user, loading, setUser } = useUser();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("profile");

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const data = {
            username: e.target[0].value,
        };
        const newUser = await ProfileApi.updateUser(data);
        if (newUser == null) return;
        setEdit(false);
        setUser(newUser);
    };

    useEffect(() => {
        if (!user && !loading) navigate("/auth");
    }, [user, loading]);

    if (!user) return <div />;

    return (
        <div className="min-h-screen w-full py-10 flex flex-col items-center justify-center">
            {/* profile nav bar */}
            <div className="flex flex-row text-white bg-white/5 rounded-xl p-2 border border-white/10 mb-8 space-between">
                <button
                    className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                activeTab === "profile"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
                    onClick={setActiveTab.bind(null, "profile")}
                >
                    Profile
                </button>

                <button
                    className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                    activeTab === "friends"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                    onClick={setActiveTab.bind(null, "friends")}
                >
                    Friends
                </button>

                <button
                    className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                    activeTab === "stats"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/10" 
                    }`}
                    onClick={setActiveTab.bind(null, "stats")}
                >
                    Stats
                </button>

                <button
                    className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                    activeTab === "users"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                    onClick={setActiveTab.bind(null, "users")}
                >
                    All Users
                </button>
            </div>

            {/* cards */}
            <div className="w-[900px] h-[600px] p-6 bg-black/40 rounded-2xl shadow-2xl border border-white/10">
                <div className="w-full h-full flex items-center justify-center">
                    {/* Profile Card */}
                    {activeTab === "profile" && (
                        <div className="w-full h-full">
                            <ProfileCard />
                        </div>
                    )}
                    
                    {/* Friends page */}
                    {activeTab === "friends" && (
                        <div className="w-full h-full overflow-y-auto">
                            <Friends />
                        </div>
                    )}
                    
                    {/* Stats */}
                    {activeTab === "stats" && (
                        <div className="w-full h-full flex flex-row items-center justify-center gap-8">
                            <div className="flex-1">
                                <UserStats userId={userId || user.id} />
                            </div>
                            <div className="flex-1">
                                <GameHistory userId={userId || user.id} />
                            </div>
                        </div>
                    )}

                    {/* All Users */}
                    {activeTab === "users" && (
                        <div className="w-full h-full">
                            <AllUsers />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
