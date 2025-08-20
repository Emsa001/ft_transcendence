"use client";
import React, { useEffect, useState } from "react";
import { UserDTOType } from "shared";
import ProfileApi from "../service/profileApi";
import FriendsApi from "../service/friendsApi";

export function AllUsers() {
    const [allUsers, setAllUsers] = useState<UserDTOType[]>([]);
    const [friends, setFriends] = useState<UserDTOType[]>([]);
    const [friendRequests, setFriendRequests] = useState<UserDTOType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const [newUsers, newFriends, newFriendRequests] = await Promise.all(
                [
                    ProfileApi.getAllUsers(),
                    FriendsApi.getAllFriends(),
                    FriendsApi.getFriendRequests(),
                ]
            );
            setFriends(newFriends);
            setFriendRequests(newFriendRequests);

            const friendUsernames = new Set(newFriends.map((f) => f.username));
            const filteredUsers = newUsers.filter(
                (user) => !friendUsernames.has(user.username)
            );
            setAllUsers(filteredUsers);
        };
        fetchData();
    }, []);

    const handleAddFriend = async (friendId: string) => {
        await FriendsApi.addFriend(friendId);
    };

    const handleAcceptFriendRequest = async (friendId: string) => {
        await FriendsApi.acceptFriendRequest(friendId);
    };

    const handleRemoveFriend = async (friendId: string) => {
        await FriendsApi.removeFriend(friendId);
    };

    return (
        <div className="flex gap-8">
            {/* All Users */}
            <div className="flex-1 bg-white/10 rounded-xl p-4 mb-4">
                <h3 className="text-lg font-bold mb-2 text-white">All Users</h3>
                <ul className="divide-y divide-white/20">
                    {allUsers.map((user: UserDTOType) => (
                        <li
                            key={user.id}
                            className="py-2 flex items-center gap-2 justify-between"
                        >
                            <span className="font-medium text-white">
                                {user.username}
                            </span>
                            {friendRequests.some(
                                (req) => req.username === user.username
                            ) ? (
                                <button
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                    onClick={() =>
                                        handleAcceptFriendRequest(
                                            user.id.toString()
                                        )
                                    }
                                >
                                    accept
                                </button>
                            ) : (
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                    onClick={() =>
                                        handleAddFriend(user.id.toString())
                                    }
                                >
                                    add
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            {/* Friends */}
            <div className="flex-1 bg-white/10 rounded-xl p-4 mb-4">
                <h3 className="text-lg font-bold mb-2 text-white">Friends</h3>
                <ul className="divide-y divide-white/20">
                    {friends.map((friend: UserDTOType) => (
                        <li
                            key={friend.id}
                            className="py-2 flex items-center gap-2 justify-between"
                        >
                            <span className="font-medium text-white">
                                {friend.username}
                            </span>
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                onClick={() =>
                                    handleRemoveFriend(friend.id.toString())
                                }
                            >
                                remove
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
