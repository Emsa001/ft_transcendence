import { LogoutButton } from "@features/auth";
import { useUser } from "@features/auth/model/useUser";

import React, { useState } from "react";
import { SettingsModal } from "./Settings";

export function ContactInfo() {
    const { user } = useUser();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    if (!user) return <div />;
    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
                <h2 className="text-xl font-bold">User Info</h2>
                <button
                    type="button"
                    className="px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600 transition"
                    aria-label="Settings"
                    onClick={() => setIsSettingsOpen(true)}
                >
                    Settings
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="text-gray-400">Username</p>
                    <p>{user.username}</p>
                </div>
                <div>
                    <p className="text-gray-400">Email</p>
                    <p>{user.email ? user.email : "No email :("}</p>
                </div>
                <div>
                    <p className="text-gray-400">User ID</p>
                    <p>{user.id}</p>
                </div>
                <LogoutButton className="md:col-span-2 text-lg mt-2 w-full bg-red-500/80 hover:bg-red-600/80 text-white rounded-lg shadow border border-red-300/40 transition" />
            </div>
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    );
}
