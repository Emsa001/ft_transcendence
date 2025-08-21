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
        setEdit(false);
        setUser(newUser);
    };

    useEffect(() => {
        if (!user && !loading) navigate("/auth");
    }, [user, loading]);

    if (!user) return <div />;

    return (
        <div className="min-h-screen w-full py-6 flex flex-col items-center justify-center">
            {/* profile nav bar */}
            <div className="text-white bg-white/5 rounded-xl p-1 border border-white/10">
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

                <button
                    className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                    activeTab === "history"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                    onClick={setActiveTab.bind(null, "history")}
                >
                    History
                </button>
            </div>

            {/* cards */}
            <div className="w-96 h-96">
                {/* Profile Card */}
                {activeTab === "profile" && <ProfileCard />}

                {/* Stats */}
                {activeTab === "stats" && (
                    <UserStats userId={userId || user.id} />
                )}

                {/* Game History */}
                {activeTab === "history" && (
                    <GameHistory userId={userId || user.id} />
                )}

                {/* Game History */}
                {activeTab === "users" && <AllUsers />}

                {/* friends page */}
                {activeTab === "friends" && <Friends />}
            </div>
        </div>
    );
};
