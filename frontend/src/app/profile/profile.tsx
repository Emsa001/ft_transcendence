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
import { ChangePassword } from "@features/user/ui/ChangePassword";

export const ProfileCard = () => {
    const [edit, setEdit] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);

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

    const handleChangePassword = async (e: any) => {
        e.preventDefault();
        const data = {
            oldPassword: e.target[0].value,
            newPassword: e.target[1].value,
        };
        await ProfileApi.updateUser(data);
        setShowChangePassword(false);
    };

    useEffect(() => {
        if (!user && !loading) navigate("/auth");
    }, [user, loading]);

    if (!user) return <div />;

    return (
        <div className="h-full w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg p-6 mb-8 text-white">
            <div className="flex flex-row justify-between items-start">
                <div className="flex flex-col md:flex-row items-start gap-6 flex-1">
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
                            className="w-full space-y-3 flex-1 pr-4"
                        >
                            <input
                                type="text"
                                name="username"
                                defaultValue={user.username}
                                className="w-full p-2 rounded bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Username"
                            />
                            <button
                                type="submit"
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                            >
                                Save Changes
                            </button>
                        </form>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <button
                        className="text-white px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        onClick={() => setEdit(!edit)}
                    >
                        {edit ? "Cancel" : "Edit"}
                    </button>
                    <button
                        className="text-white px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        onClick={() =>
                            setShowChangePassword(!showChangePassword)
                        }
                    >
                        {showChangePassword ? "Cancel" : "Change Password"}
                    </button>
                </div>
            </div>

            {/* Change Password Form */}
            {showChangePassword && (
                <ChangePassword setShowChangePassword={setShowChangePassword} />
            )}

            {/* 2FA Toggle */}
            <div className="mt-6">
                {user.is2FAEnabled ? (
                    <TwoFactorAuthDisable />
                ) : (
                    <TwoFactorAuthEnable />
                )}
            </div>

            {/* Logout & Delete */}
            <div className="mt-4 flex gap-2 items-center">
                <LogoutButton />
                <DeleteButton />
            </div>
        </div>
    );
};
