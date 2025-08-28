import React, { useEffect, useNavigate, useState } from "react";
import {
    LogoutButton,
    TwoFactorAuthDisable,
    TwoFactorAuthEnable,
} from "@features/auth";
import { useUser } from "@features/auth/model/useUser";
import { UserPicture } from "@features/user/ui/UserPicture";
import ProfileApi from "@features/user/service/profileApi";
import { DeleteButton } from "@features/user/ui/Delete";

export const ProfileCard = () => {
    // Just for test - get user ID from URL query params to see their stats
    const query = new URLSearchParams(window.location.search);
    const userId = query.get("id");
    const [edit, setEdit] = useState(false);

    const { user, loading, setUser } = useUser();
    const navigate = useNavigate();

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
        <div className=" h-full w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg p-15 mb-8 text-white">
            <div className="flex flex-row">
                <div className="flex flex-col md:flex-row items-start gap-6 flex-4">
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

                <button
                    className="flex-1 text-white p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors z-10"
                    onClick={() => setEdit(!edit)}
                >
                    {edit ? "Cancel" : "Edit"}
                </button>
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
    );
};
