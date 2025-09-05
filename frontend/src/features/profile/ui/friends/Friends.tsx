import React, { useEffect, useState } from "react";
import { UserDTOType } from "shared";
import FriendsApi from "../../../user/service/friendsApi";
import { SearchModal } from "./Search";
import { MyFriends } from "./MyFriends";
import { FriendRequests } from "./FriendRequests";
import { useLanguage } from "@features/language/model/useLanguage";

let ws: WebSocket | undefined;

export const Friends = () => {
    const [friends, setFriends] = useState<UserDTOType[]>([]);
    const [friendRequests, setFriendRequests] = useState<UserDTOType[]>([]);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const { getText } = useLanguage();
    const texts = getText("profile.friends");

    useEffect(() => {
        const fetchData = async () => {
            const newFriends = await FriendsApi.getAllFriends();
            const newFriendRequests = await FriendsApi.getFriendRequests();
            setFriends(newFriends);
            setFriendRequests(newFriendRequests);
        };
        fetchData();
    }, []);

    useEffect(() => {
        ws = new WebSocket(`ws://localhost:8000/friends`);
        ws.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "NEW_FRIEND_REQUEST") {
                const newFriendRequests = await FriendsApi.getFriendRequests();
                setFriendRequests(newFriendRequests);
            } else if (data.type === "FRIEND_REQUEST_ACCEPTED") {
                const newFriends = await FriendsApi.getAllFriends();
                setFriends(newFriends);
            } else if (data.type === "FRIEND_REMOVED") {
                const newFriends = await FriendsApi.getAllFriends();
                const newFriendRequests = await FriendsApi.getFriendRequests();
                setFriends(newFriends);
                setFriendRequests(newFriendRequests);
            }
        };

        return () => {
            if (ws) ws.close();
        };
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
                <h2 className="text-xl font-bold">{texts.title}</h2>
                <button
                    type="button"
                    className="px-3 py-1 rounded bg-gray-700/50 text-white hover:bg-gray-600 transition"
                    aria-label="Search"
                    onClick={() => setIsSearchModalOpen(true)}
                >
                    {texts.search}
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
};
