import React, { useEffect, useState } from "react";
import { UserDTOType } from "shared";
import FriendsApi from "../../../user/service/friendsApi";
import { SearchModal } from "./Search";
import { MyFriends } from "./MyFriends";
import { FriendRequests } from "./FriendRequests";

export function Friends() {
    const [friends, setFriends] = useState<UserDTOType[]>([]);
    const [friendRequests, setFriendRequests] = useState<UserDTOType[]>([]);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const newFriends = await FriendsApi.getAllFriends();
            const newFriendRequests = await FriendsApi.getFriendRequests();
            setFriends(newFriends);
            setFriendRequests(newFriendRequests);
        };
        fetchData();
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
                <h2 className="text-xl font-bold">Friends</h2>
                <button
                    type="button"
                    className="px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600 transition"
                    aria-label="Settings"
                    onClick={() => setIsSearchModalOpen(true)}
                >
                    Search
                </button>
            </div>

            <div className="h-124 overflow-y-auto rounded-lg scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                {friendRequests.length > 0 && (
                    <FriendRequests
                        friendRequests={friendRequests}
                        setFriendRequests={setFriendRequests}
                        setFriends={setFriends}
                        friends={friends}
                    />
                )}
                <MyFriends friends={friends} setFriends={setFriends} />
            </div>

            <SearchModal
                isOpen={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
            />
        </div>
    );
}
