import React, { useState, useNavigate, useEffect } from "react";
import {
    LogoutButton,
    TwoFactorAuthDisable,
    TwoFactorAuthEnable,
} from "@features/auth";
import { useUser } from "@features/auth/model/useUser";
import FriendsApi from "@features/user/service/friendsApi";
import { UserDTOType } from "shared";

export default function Friends() {
    const { user } = useUser();
    const [friends, setFriends] = useState<UserDTOType[]>([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const allFriends = await FriendsApi.getAllFriends();
                setFriends(allFriends);
            } catch (error) {
                console.error("Error fetching friends:", error);
            }
        };

        fetchFriends();
    }, []);

    if (!user || typeof user !== "object") {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white flex items-center justify-center">
                <div className="text-2xl">Loading...</div>
            </div>
        );
    }

    const handleAddFriend = async (friendId: number) => {
        try {
            await FriendsApi.addFriend(friendId.toString());
            setFriends((prev) => [...prev, { id: friendId } as UserDTOType]);
        } catch (error) {
            console.error("Error adding friend:", error);
        }
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">My Friends</h1>
                <p className="text-gray-400">
                    You have {friends.length} friends
                </p>
            </div>

            <div className="space-y-4 mb-8">
                {friends.map((friend) => (
                    <div
                        key={friend.id}
                        className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img
                                        src={friend.avatar}
                                        alt={friend.username}
                                        className="w-12 h-12 rounded-full ring-2 ring-purple-500/30"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black"></div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white-800">
                                        {friend.username}
                                    </h3>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm">
                                    Message
                                </button>
                                <button className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors text-sm">
                                    Game
                                </button>
                                <button
                                    onClick={() => handleAddFriend(friend.id)}
                                >
                                    Add Friend
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
                <button className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                    Add Friend
                </button>
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                    Find Players
                </button>
            </div>
        </div>
    );
}
