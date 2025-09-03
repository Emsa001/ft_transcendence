import React, { useEffect } from "react";
import { UserPicture } from "@features/user/ui/UserPicture";
import { useOnlineUsers } from "@features/user/model/useOnlineUsers";
import { usechat } from "../model/ChatContext";
import { UserDTOType } from "shared";
import { useLanguage } from "@features/language/model/useLanguage";

interface UserCardProps {
    user: UserDTOType;
    isOnline: boolean;
    selectedUser?: UserDTOType | null;
    onClick: () => void;
}

function UserCard({ user, isOnline, selectedUser, onClick }: UserCardProps) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition hover:bg-cyan-900/40 border-b-2 border-cyan-800
                ${selectedUser?.id === user.id ? "bg-cyan-800/40" : ""}
            `}
        >
            <div className="relative">
                <UserPicture
                    userId={user.id}
                    className="w-10 h-10 rounded-full shadow-[0_0_8px_rgba(0,255,255,0.7)]"
                />
                <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black
                        ${isOnline ? "bg-green-400 shadow-[0_0_6px_rgba(34,197,94,0.8)]" : "bg-red-400 shadow-[0_0_6px_rgba(239,68,68,0.8)]"}
                    `}
                />
            </div>
            <span className="font-medium text-cyan-300 drop-shadow-[0_0_6px_rgba(0,255,255,0.7)]">
                {user.username}
            </span>
        </div>
    );
}

export function Sidebar() {
    const { users, selectedUser, setSelectedUser } = usechat();
    const { onlineUsers } = useOnlineUsers();

    const { getText } = useLanguage();
    const text = getText("friends");

    return (
        <div className="w-1/3 border-r border-gray-800 bg-black/50 p-4 z-[10]">
            <h2 className="text-lg p-2 font-semibold mb-3 text-cyan-400 drop-shadow-[0_0_6px_rgba(0,255,255,0.8)]">
                {text}
            </h2>
            <div className="border-b-2 border-cyan-600 mb-2 shadow-[0_0_12px_rgba(0,255,255,0.8)]" />

            <div className="space-y-2 max-h-[calc(100vh-120px)] overflow-y-auto pr-1">
                {users.map((user) => (
                    <div key={user.id}>
                        <UserCard
                            user={user}
                            isOnline={onlineUsers.includes(user.id)}
                            selectedUser={selectedUser}
                            onClick={() => setSelectedUser(user)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
