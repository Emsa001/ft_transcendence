import { useUser } from "@features/auth/model/useUser";

import React, { useState } from "react";
import { SettingsModal } from "./Settings";
import { useLanguage } from "@features/language/model/useLanguage";

export function ContactInfo() {
    const { user } = useUser();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const { getText } = useLanguage();
    const texts = getText("profile.contactInfo");

    if (!user) return <div />;

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
                <h2 className="text-xl font-bold">{texts.title}</h2>
                <button
                    type="button"
                    className="px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600 transition"
                    aria-label="Settings"
                    onClick={() => setIsSettingsOpen(true)}
                >
                    {texts.settings}
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="text-gray-400">{texts.username}</p>
                    <p>{user.username}</p>
                </div>
                <div>
                    <p className="text-gray-400">{texts.userId}</p>
                    <p>{user.id}</p>
                </div>
            </div>
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    );
}
