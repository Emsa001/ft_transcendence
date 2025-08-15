import React, { useEffect, useNavigate } from "react";
import {
    LogoutButton,
    TwoFactorAuthDisable,
    TwoFactorAuthEnable,
} from "@features/auth";
import { useUser } from "@features/auth/model/useUser";
import { UserStats } from "@features/user/ui/UserStats";
import { GameHistory } from "@features/user/ui/GameHistory";
import { UserAvatar } from "@features/user/ui/UserAvatar";

export const Profile = () => {
    // Just for test - get user ID from URL query params to see their stats
    const query = new URLSearchParams(window.location.search);
    const userId = query.get("id");

    const { user, loading } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user && !loading) navigate("/auth");
    }, [user, loading]);

    if (!user) return <div />;

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 p-6 flex flex-col items-center justify-center">
            {/* Profile Card */}
            <div className="max-w-3xl w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg p-6 mb-8 text-white">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <UserAvatar src={user.avatar} name={user.name} />
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
