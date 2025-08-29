import React, { useEffect, useState } from "react";
import { UserDTOType } from "shared";
import { Sidebar } from "@features/chat/ui/Sidebar";
import FriendsApi from "@features/user/service/friendsApi";
import { ChatArea } from "@features/chat/ui/ChatArea";

export default function Chat() {
    const [selectedUser, setSelectedUser] = useState<UserDTOType | null>(null);
    const [users, setUsers] = useState<UserDTOType[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const allUsers = await FriendsApi.getAllFriends();
            setUsers(allUsers);
        };
        fetchUsers();
    }, []);

    return (
        <div className="flex h-full text-white pt-16 ">
            {/* Left Sidebar */}
            <Sidebar
                users={users}
                selectedUser={selectedUser}
                onSelectUser={setSelectedUser}
            />

            {/* Chat Area */}
            <div className="flex flex-col w-2/3 bg-black/50 ">
                {selectedUser ? (
                    <ChatArea selectedUser={selectedUser} />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        Please choose a user to start chatting
                    </div>
                )}
            </div>
        </div>
    );
}
