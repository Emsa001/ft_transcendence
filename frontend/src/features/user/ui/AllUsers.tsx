"use client";
import React, { useEffect, useState } from "react";
import { UserDTOType } from "shared";
import ProfileApi from "../service/profileApi";
import FriendsApi from "../service/friendsApi";
import blockUserApi from "../service/blockUserApi";

export const AllUsers = () => {
    const [allUsers, setAllUsers] = useState<UserDTOType[]>([]);
    const [friends, setFriends] = useState<UserDTOType[]>([]);
    const [blockedUsers, setBlockedUsers] = useState<UserDTOType[]>([]);
    const [friendRequests, setFriendRequests] = useState<UserDTOType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const [newUsers, newFriends, newFriendRequests, newBlockedUsers] =
                await Promise.all([
                    ProfileApi.getAllUsers(),
                    FriendsApi.getAllFriends(),
                    FriendsApi.getFriendRequests(),
                    blockUserApi.getAll(),
                ]);
            if (newFriendRequests) setFriendRequests(newFriendRequests);

            if (newFriends && newBlockedUsers) {
                setBlockedUsers(newBlockedUsers);
                setFriends(newFriends);
                const friendUsernames = new Set(
                    newFriends.map((f) => f.username)
                );
                const blockedUsernames = new Set(
                    newBlockedUsers.map((b) => b.username)
                );
                const filteredUsers = newUsers.filter(
                    (user) =>
                        !friendUsernames.has(user.username) &&
                        !blockedUsernames.has(user.username)
                );
                setAllUsers(filteredUsers);
            }
        };
        fetchData();
    }, []);

    const handleAddFriend = async (friendId: number) => {
        await FriendsApi.addFriend(friendId);
    };

    const handleAcceptFriendRequest = async (friendId: number) => {
        await FriendsApi.acceptFriendRequest(friendId);
    };

    const handleRemoveFriend = async (friendId: number) => {
        await FriendsApi.removeFriend(friendId);
    };

    const handleUnblockUser = async (userId: number) => {
        await blockUserApi.unblockUser(userId);
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
                                        handleAcceptFriendRequest(user.id)
                                    }
                                >
                                    accept
                                </button>
                            ) : (
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                    onClick={() => handleAddFriend(user.id)}
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
                                onClick={() => handleRemoveFriend(friend.id)}
                            >
                                remove
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex-1 bg-white/10 rounded-xl p-4 mb-4">
                <h3 className="text-lg font-bold mb-2 text-white">Blocked</h3>
                <ul className="divide-y divide-white/20">
                    {blockedUsers.map((user: UserDTOType) => (
                        <li
                            key={user.id}
                            className="py-2 flex items-center gap-2 justify-between"
                        >
                            <span className="font-medium text-white">
                                {user.username}
                            </span>
                            <button
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded z-10"
                                onClick={() => handleUnblockUser(user.id)}
                            >
                                unblock
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
