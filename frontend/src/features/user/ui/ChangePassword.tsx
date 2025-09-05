import React from "react";
import ProfileApi from "@features/user/service/profileApi";

interface ChangePasswordProps {
    setShowChangePassword: any;
}

export const ChangePassword = ({
    setShowChangePassword,
}: ChangePasswordProps) => {
    const handleChangePassword = async (e: any) => {
        e.preventDefault();
        const data = {
            oldPassword: e.target[0].value,
            newPassword: e.target[1].value,
        };
        const user = await ProfileApi.updateUser(data);
        if (user) {
            setShowChangePassword(false);
        }
    };

    return (
        <form
            onSubmit={handleChangePassword}
            className="mt-6 space-y-3 bg-white/5 p-4 rounded-xl border border-white/20"
        >
            <input
                type="password"
                placeholder="Old Password"
                className="w-full p-2 rounded bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="password"
                placeholder="New Password"
                className="w-full p-2 rounded bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="submit"
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
                Save Password
            </button>
        </form>
    );
};
