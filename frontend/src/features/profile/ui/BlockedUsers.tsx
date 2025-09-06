import React, { useEffect, useNavigate, useState } from "react";
import { UserDTOType } from "shared";
import blockUserApi from "../../user/service/blockUserApi";
import { UserPicture } from "@features/user/ui/UserPicture";
import { useLanguage } from "@features/language/model/useLanguage";
import { Modal } from "@shared/components/Modal";


interface BlockedUsersModalProps {
    onClose: () => void;
    isOpen: boolean;
}

// const fakeUsers: UserDTOType[] = [
//     { id: 1, username: "BlockedUser1" },
//     { id: 2, username: "BlockedUser2" },
//     { id: 3, username: "BlockedUser3" },
//     { id: 4, username: "BlockedUser4" },
//     { id: 5, username: "BlockedUser5" },
//     { id: 6, username: "BlockedUser6" },
//     { id: 7, username: "BlockedUser7" },
//     { id: 8, username: "BlockedUser8" },
//     { id: 9, username: "BlockedUser9" },
//     { id: 10, username: "BlockedUser10" },
// ];


export function BlockedUsersModal({ onClose, isOpen }: BlockedUsersModalProps) {
    const [blockedUsers, setBlockedUsers] = useState<UserDTOType[]>([]);
    const { getText } = useLanguage();
    const texts = getText("profile.blockedUsers");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const newBlockedUsers = await blockUserApi.getAll();
            setBlockedUsers(newBlockedUsers);
        };
        fetchData();
    }, []);

    const handleUnblockUser = async (userId: number) => {
        await blockUserApi.unblockUser(userId);
        setBlockedUsers((prev) => prev.filter((user) => user.id !== userId));
    };

    return (
        <div>
            <Modal isOpen={isOpen} onClose={onClose}>
                <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2 text-gray-100">
                    {texts.title}
                </h2>

                <div className="h-70 overflow-y-auto rounded-lg scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                    {blockedUsers.map((user: UserDTOType) => (
                        <li
                            key={user.id}
                            className="flex items-center justify-between py-3 px-2 bg-gray-700/60 hover:bg-gray-700 mb-2 rounded-lg transition-colors"
                        >
                            <div className="group flex items-center gap-3">
                                <UserPicture
                                    userId={user.id}
                                    size={8} 
                                    className="w-9 h-9 rounded-full"
                                />
                                <span className="font-medium text-gray-200 group-hover:underline group-hover:cursor-pointer"
                                    onClick={() => navigate(`/profile/${user.id}`)}>
                                    {user.username}
                                </span>
                            </div>

                            <button
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-md text-sm font-medium transition"
                                onClick={() => handleUnblockUser(user.id)}
                            >
                                {texts.unblock}
                            </button>
                        </li>
                    ))}
                </div>
            </Modal>
        </div>
    );
}
