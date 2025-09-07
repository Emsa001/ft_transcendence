import { useUser } from "@features/auth/model/useUser";

import React, { useState } from "react";
import { SettingsModal } from "./Settings";
import { useLanguage } from "@features/language/model/useLanguage";
import { BlockedUsersModal } from "./BlockedUsers";
import { slice } from "lodash";
import { sliceText } from "@shared/lib/utils";

export const ContactInfo = () => {
    const { user } = useUser();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isBlocklistOpen, setIsBlocklistOpen] = useState(false);

    const { getText } = useLanguage();
    const texts = getText("profile.contactInfo");

    if (!user) return <div />;
    return (
        <div className="w-full h-full">
            <div className="w-full h-full flex flex-col justify-evenly">
                <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
                    <h2 className="text-xl font-bold">{texts.title}</h2>
                    <button
                        type="button"
                        className="px-3 py-1 rounded bg-gray-700/50 text-white hover:bg-gray-600/50 transition"
                        aria-label="Settings"
                        onClick={() => setIsSettingsOpen(true)}
                    >
                        {texts.settings}
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-400">{texts.username}</p>
                        <p>{sliceText(user.username, 10)}</p>
                    </div>
                    <div>
                        <p className="text-gray-400">{texts.userId}</p>
                        <p>{user.id}</p>
                    </div>
                </div>
                <button
                    type="button"
                    className="w-35 items-left mt-4 px-3 py-1 rounded bg-rose-400/50 text-white hover:bg-gray-600/50 transition"
                    onClick={() => setIsBlocklistOpen(true)}
                >
                    Blocked Users
                </button>
            </div>
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
            <BlockedUsersModal
                isOpen={isBlocklistOpen}
                onClose={() => setIsBlocklistOpen(false)}
            />
        </div>
    );
};
