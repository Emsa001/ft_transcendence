import React, { useNavigate } from "react";
import { UserPicture } from "@features/user/ui/UserPicture";
import blockUserApi from "@features/user/service/blockUserApi";
import { useChat } from "../model/ChatContext";
import { useLanguage } from "@features/language/model/useLanguage";

export function UserInfo() {
    const navigate = useNavigate();
    const { selectedUser, users, setUsers, handleSelectUser } = useChat();

    const { getText } = useLanguage();
    const text = getText("chat.blockUserButton");
    if (!selectedUser) return <div />;

    const handleBlockUser = async () => {
        await blockUserApi.blockUser(selectedUser.id);
        setUsers(users.filter((user) => user.id !== selectedUser.id));
        handleSelectUser();
    };

    return (
        <div
            onClick={() => navigate(`/profile/${selectedUser.id}`)}
            className="h-18 border-b gap-2 border-gray-800 flex items-center px-4 cursor-pointer shadow-[0_0_10px_rgba(0,255,255,0.3)] relative"
        >
            <UserPicture
                userId={selectedUser.id}
                size={8} 
                className="w-10 h-10 rounded-full shadow-[0_0_8px_rgba(0,255,255,0.7)]"
            />
            <h3 className="font-semibold text-cyan-300 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
                {selectedUser.username}
            </h3>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleBlockUser();
                }}
                className="ml-auto px-4 py-1 text-sm rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-800 text-red-300 shadow-[0_0_8px_rgba(255,0,0,0.5)] transition"
            >
                {text}
            </button>
        </div>
    );
}
