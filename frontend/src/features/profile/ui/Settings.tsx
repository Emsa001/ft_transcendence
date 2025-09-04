import { useUser } from "@features/auth/model/useUser";
import { MyPicture } from "@features/user/ui/UserPicture";
import { Modal } from "@shared/components/Modal";
import ProfileApi from "@features/user/service/profileApi";
import React, { useState } from "react";
import { useLanguage } from "@features/language/model/useLanguage";

interface SettingsModalProps {
    onClose: () => void;
    isOpen: boolean;
}

export function SettingsModal({ onClose, isOpen }: SettingsModalProps) {
    const { user, setUser } = useUser();
    const [username, setUsername] = useState(user?.username || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const { getText } = useLanguage();
    const texts = getText("profile.settings");

    const handleChangeUsername = async () => {
        const data = {
            username,
        };
        const user = await ProfileApi.updateUser(data);
        if (user) {
            onClose();
            setUser(user);
        }
    };

    const handleChangePassword = async () => {
        const data = {
            oldPassword: currentPassword,
            newPassword,
        };
        await ProfileApi.updateUser(data);
        onClose();
    };

    const handleDelete = async () => {
        const isConfirmed = window.confirm(
            "Are you sure you want to delete your account?"
        );
        if (!isConfirmed) return;
        const status = await ProfileApi.deleteUser();
        if (status) {
            setUser(null);
        }
    };

    return (
        <div>
            <Modal isOpen={isOpen} onClose={onClose}>
                <h2 className="text-xl font-bold mb-4 text-center">
                    {texts.title}
                </h2>

                <div className="flex justify-center mb-6">
                    <MyPicture />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        {texts.changeUsername}
                    </label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
                        value={username}
                        onChange={(e: any) => setUsername(e.target.value)}
                        placeholder={texts.enterUsername}
                    />
                    <button
                        className="mt-2 w-full px-4 py-2 bg-blue-500/80 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition"
                        onClick={handleChangeUsername}
                    >
                        {texts.saveUsername}
                    </button>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">
                        {texts.changePassword}
                    </label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 mb-3"
                        value={currentPassword}
                        onChange={(e: any) =>
                            setCurrentPassword(e.target.value)
                        }
                        placeholder={texts.currentPassword}
                    />
                    <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
                        value={newPassword}
                        onChange={(e: any) => setNewPassword(e.target.value)}
                        placeholder={texts.newPassword}
                    />
                    <button
                        className="mt-2 w-full px-4 py-2 bg-blue-500/80 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition"
                        onClick={handleChangePassword}
                    >
                        {texts.changePasswordButton}
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        {texts.deleteAccount}
                    </label>
                    <button
                        className="p-1 text-lg mt-2 w-full bg-red-500/80 hover:bg-red-600/80 text-white rounded-lg shadow border border-red-300/40 transition"
                        onClick={handleDelete}
                    >
                        {texts.deleteAccount}
                    </button>
                </div>
            </Modal>
        </div>
    );
}
