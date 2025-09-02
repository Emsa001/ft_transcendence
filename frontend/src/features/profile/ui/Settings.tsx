import { useUser } from "@features/auth/model/useUser";
import { DeleteButton } from "@features/user/ui/Delete";
import { MyPicture } from "@features/user/ui/UserPicture";
import { Modal } from "@shared/components/Modal";
import ProfileApi from "@features/user/service/profileApi";
import React, { useState } from "react";

interface SettingsModalProps {
    onClose: () => void;
    isOpen: boolean;
}

export function SettingsModal({ onClose, isOpen }: SettingsModalProps) {
    const { user, setUser } = useUser();
    const [username, setUsername] = useState(user?.username || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleChangeUsername = async () => {
        const data = {
            username,
        };
        const user = await ProfileApi.updateUser(data);
        setUser(user);
    };

    const handleChangePassword = async () => {
        const data = {
            oldPassword: currentPassword,
            newPassword,
        };
        await ProfileApi.updateUser(data);
    };

    return (
        <div>
            <Modal isOpen={isOpen} onClose={onClose}>
                <h2 className="text-xl font-bold mb-4 text-center">Settings</h2>

                <div className="flex justify-center mb-6">
                    <MyPicture />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Change Username
                    </label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
                        value={username}
                        onChange={(e: any) => setUsername(e.target.value)}
                        placeholder="Enter username"
                    />
                    <button
                        className="mt-2 w-full px-4 py-2 bg-blue-500/80 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition"
                        onClick={handleChangeUsername}
                    >
                        Save Username
                    </button>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">
                        Change Password
                    </label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 mb-3"
                        value={currentPassword}
                        onChange={(e: any) =>
                            setCurrentPassword(e.target.value)
                        }
                        placeholder="Enter current password"
                    />
                    <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
                        value={newPassword}
                        onChange={(e: any) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                    />
                    <button
                        className="mt-2 w-full px-4 py-2 bg-blue-500/80 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition"
                        onClick={handleChangePassword}
                    >
                        Change Password
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Delete Account
                    </label>
                    <DeleteButton className="md:col-span-2 text-lg mt-2 w-full bg-red-500/80 hover:bg-red-600/80 text-white rounded-lg shadow border border-red-300/40 transition" />
                </div>
            </Modal>
        </div>
    );
}
