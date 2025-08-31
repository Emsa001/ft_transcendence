import { UserPicture } from "@features/user/ui/UserPicture";
import React, { useNavigate } from "react";
import { UserDTOType } from "shared";

import blockUserApi from "@features/user/service/blockUserApi";

interface UserInfoProps {
    user: UserDTOType;
    selectedUser: UserDTOType;
    users: UserDTOType[];
    setUsers: (users: UserDTOType[]) => void;
    setSelectedUser: (user: UserDTOType | null) => void;
}

export function UserInfo({
    user,
    selectedUser,
    users,
    setUsers,
    setSelectedUser,
}: UserInfoProps) {
    const navigate = useNavigate();

    const handleBlockUser = async () => {
        await blockUserApi.blockUser(selectedUser.id);
        setUsers(users.filter((user) => user.id !== selectedUser.id));
        setSelectedUser(null);
    };

    return (
        <div
            onClick={() => navigate(`/users/${selectedUser.id}`)}
            className="h-18 border-b gap-2 border-gray-800 flex items-center px-4 cursor-pointer shadow-[0_0_10px_rgba(0,255,255,0.3)] relative"
        >
            <UserPicture
                userId={user.id.toString()}
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
                Block user
            </button>
        </div>
    );
}
