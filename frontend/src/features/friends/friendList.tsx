import React, { useState, useNavigate, useEffect } from "react";
import FriendsApi from "@features/user/service/friendsApi";
import { UserDTOType } from "shared";
import { useFriends } from "./context";
import { useOnlineUsers } from "@features/user/model/useOnlineUsers";
import { OtherUserPicture } from "@features/user/ui/UserPicture";

export function FriendsList() {
    const { friends, setFriends } = useFriends();
    const { onlineUsers } = useOnlineUsers();

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const allFriends = await FriendsApi.getAllFriends();
                setFriends(allFriends);
            } catch (error) {}
        };

        fetchFriends();
    }, []);

    const handleRemoveFriend = async (friendId: number) => {
        try {
            await FriendsApi.removeFriend(friendId);
            setFriends((prev: UserDTOType[]) =>
                prev.filter((friend) => friend.id !== friendId)
            );
        } catch (error) {}
    };

    /* // make the overflow-y-auto (the scrolling) be AFTER the title and friends counter somehow */
    return (
        <div className="mb-1 p-2 bg-white/10 rounded-xl flex-3">
            <div className="pl-2 py-1">
                <h1 className="text-3xl font-bold">My Friends</h1>
                <p className="text-gray-400">
                    You have {friends.length} friends
                </p>
            </div>
            <div className="overflow-y-auto max-h-96 space-y-2">
                {friends.map((friend: UserDTOType) => (
                    <div
                        key={friend.id}
                        className="overflow-y-auto
                    bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <OtherUserPicture
                                        userId={friend.id}
                                        size={8}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white-800">
                                        {friend.username}
                                    </h3>
                                </div>
                            </div>
                            <div className="flex gap-2 rounded bg-red-800 p-1">
                                <button
                                    onClick={() =>
                                        handleRemoveFriend(friend.id)
                                    }
                                >
                                    remove friend
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
