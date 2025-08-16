import React, { useEffect, useNavigate, useState } from "react";
import {
    LogoutButton,
    TwoFactorAuthDisable,
    TwoFactorAuthEnable,
} from "@features/auth";
import { useUser } from "@features/auth/model/useUser";
import { UserStats } from "@features/user/ui/UserStats";
import { GameHistory } from "@features/user/ui/GameHistory";
import { UserPicture } from "@features/user/ui/UserPicture";
import ProfileApi from "@features/user/service/profileApi";
import { InfoHandler } from "@features/user/ui/InfoHandler";

export const Profile = () => {
    // Just for test - get user ID from URL query params to see their stats
    const query = new URLSearchParams(window.location.search);
    const userId = query.get("id");
    const [edit, setEdit] = useState(false);

    const { user, loading, setUser } = useUser();
    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const name = e.target[0].value;
        const email = e.target[1].value;
        const newUser = await ProfileApi.updateUser(name, email);
        setEdit(false);
        setUser(newUser);
    };

    useEffect(() => {
        if (!user && !loading) navigate("/auth");
    }, [user, loading]);

    if (!user) return <div />;

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 p-6 flex flex-col items-center justify-center">
            {/* Profile Card */}
            <div className="max-w-3xl w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg p-6 mb-8 text-white">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <UserPicture />
                    <div>
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        <p className="text-white/80">ID: {user.id}</p>
                        <p className="text-white/80">{user.email}</p>
                    </div>
                </div>

                {/* 2FA Toggle */}
                <div className="mt-6">
                    {user.is2FAEnabled ? (
                        <TwoFactorAuthDisable />
                    ) : (
                        <TwoFactorAuthEnable />
                    )}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoHandler
                                input="Name"
                                value={user.name}
                                readonly={!edit}
                            />
                            <InfoHandler
                                input="Email"
                                value={user.email}
                                readonly={!edit}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="text-black p-2 bg-gray-200 rounded-lg"
                    >
                        Submit
                    </button>
                </form>
                <button
                    className="text-black p-2 bg-gray-200 rounded-lg"
                    onClick={() => setEdit(!edit)}
                >
                    {edit ? "Cancel" : "Edit"}
                </button>

                {/* Logout */}
                <div className="mt-4">
                    <LogoutButton />
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
        </div>
    );
};
