import React, { useEffect, useState } from "react";
import { UserDTOType } from "shared";
import FriendsApi from "../../user/service/friendsApi";
import { UserPicture } from "@features/user/ui/UserPicture";
import { SearchModal } from "./Search";

export function Friends() {
    const [friends, setFriends] = useState<UserDTOType[]>([]);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const newFriends = await FriendsApi.getAllFriends();
            setFriends(newFriends);
        };
        fetchData();
    }, []);

    const handleRemoveFriend = async (friendId: number) => {
        await FriendsApi.removeFriend(friendId);
    };

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
                {friends.map((user: UserDTOType) => (
                    <li
                        key={user.id}
                        className="flex items-center justify-between gap-3 py-3 px-2 bg-gray-700/60 hover:bg-gray-700 mb-2 rounded-lg transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <UserPicture
                                userId={user.id.toString()}
                                className="w-9 h-9 rounded-full object-cover"
                            />
                            <span className="font-medium text-gray-200">
                                {user.username}
                            </span>
                        </div>

                        <button
                            className="bg-red-500/80 hover:bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium transition"
                            onClick={() => handleRemoveFriend(user.id)}
                        >
                            Remove
                        </button>
                    </li>
                ))}
            </div>
            <SearchModal
                isOpen={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
            />
        </div>
    );
}
