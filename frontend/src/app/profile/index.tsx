import React, { useEffect, useNavigate, useState } from "react";
import {
    LogoutButton,
    TwoFactorAuthDisable,
    TwoFactorAuthEnable,
} from "@features/auth";
import { useUser } from "@features/auth/model/useUser";
import { FaEdit, FaUser, FaUsers } from "react-icons/fa";
// import Friends  from "./friends";
//import ProfileCard from "./profile";

import { UserStats } from "@features/user/ui/UserStats";
import { GameHistory } from "@features/user/ui/GameHistory";
import { UserPicture } from "@features/user/ui/UserPicture";
import ProfileApi from "@features/user/service/profileApi";
import { DeleteButton } from "@features/user/ui/Delete";

export const Profile = () => {
    // Just for test - get user ID from URL query params to see their stats
    const query = new URLSearchParams(window.location.search);
    const userId = query.get("id");
    const [edit, setEdit] = useState(false);

    const { user, loading, setUser } = useUser();
    const navigate = useNavigate();
    //const [activeTab, setActiveTab] = useState("profile");

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
        <div className="min-h-screen w-full p-6 flex flex-col items-center justify-center">
            {/* Profile Card */}
            <div className="relative max-w-3xl w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg p-6 mb-8 text-white">
                <button
                    className="absolute top-6 right-4 text-white p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors z-10"
                    onClick={() => setEdit(!edit)}
                >
                    {edit ? "Cancel" : "Edit"}
                </button>

                <div className="flex flex-col md:flex-row items-start gap-6">
                    <UserPicture />
                    {!edit ? (
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold">
                                {user.username}
                            </h2>
                            <p className="text-white/80">ID: {user.id}</p>
                            <p className="text-white/80">{user.email}</p>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className="w-full space-y-3 flex-1 pr-15"
                        >
                            <input
                                type="text"
                                name="username"
                                value={user.username}
                                defaultValue={user.username}
                                className="w-full p-2 rounded bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Username"
                            />
                            <button
                                type="submit"
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors font-medium"
                            >
                                Save Changes
                            </button>
                        </form>
                    )}
                </div>

                {/* 2FA Toggle */}
                <div className="mt-6">
                    {user.is2FAEnabled ? (
                        <TwoFactorAuthDisable />
                    ) : (
                        <TwoFactorAuthEnable />
                    )}
                </div>

                {/* Logout */}
                <div className="mt-4 flex gap-2 items-center">
                    <LogoutButton />
                    <DeleteButton />
                </div>
            </div>

            {/* Stats */}
            <div className="max-w-3xl w-full mb-8">
                <UserStats userId={userId || user.id} />
            </div>

            {/* Game History */}
            <div className="max-w-3xl w-full">
                <GameHistory userId={userId || user.id} />
            </div>
        {/* {{<div className="flex flex-col w-screen items-center justify-center bg-gradient-to-b from-black via-zinc-900 to-black text-white p-6">
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10 max-w-4xl w-full">
                
                <div className="flex justify-center mb-8">
                    <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">

						<button
						className="p-2 size-lg"
						onClick={setActiveTab.bind(null, "profile")}
						>Profile
						</button>

						<button
						className="p-2 size-lg"
						onClick={setActiveTab.bind(null, "friends")}
						>Friends
						</button>

                    </div>
                </div>

                {activeTab === "friends" && (
                    <Friends />
                )}

                {activeTab === "profile" && (
                    <ProfileCard />
                )}
            </div> */}
        </div>
    );
};