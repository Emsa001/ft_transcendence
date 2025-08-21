import React, { useState, useNavigate, useEffect } from "react";
import {
    LogoutButton,
    TwoFactorAuthDisable,
    TwoFactorAuthEnable,
} from "@features/auth";
import { useUser } from "@features/auth/model/useUser";
import FriendsApi from "@features/user/service/friendsApi";
import { UserDTOType } from "shared";
import { APIService } from "@shared/lib/api";


export default function Friends() {
    const { user } = useUser();
    const [friends, setFriends] = useState<UserDTOType[]>([]);
    const [friendRequests, setFriendRequests] = useState<UserDTOType[]>([]);
    const [sentRequests, setSentRequests] = useState<UserDTOType[]>([]);
    const [newFriend, setNewFriend] = useState<string>("");

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const allFriends = await FriendsApi.getAllFriends();
                setFriends(allFriends);
            } catch (error) {
                console.error("Error fetching friends:", error);
            }
        };

        const fetchRequests = async () => {
            try {
                const allRequests = await FriendsApi.getFriendRequests();
                setFriendRequests(allRequests);
            } catch (error) {
                console.error("Error fetching friend requests:", error);
            }
        };

        const fetchSentRequests = async () => {
            try {
                const allSentRequests = await FriendsApi.getAllSentRequests();
                setSentRequests(allSentRequests);
            } catch (error) {
                console.error("Error fetching sent friend requests:", error);
            }
        };

        fetchFriends();
        fetchRequests();
        fetchSentRequests();
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

    const handleRemoveFriend = async (friendId: number) => {
        try {
            await FriendsApi.removeFriend(friendId.toString());
            setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
        } catch (error) {
            console.error("Error removing friend:", error);
        }
    }

    const handleAcceptRequest = async (requestId: number) => {
        try {
            await FriendsApi.acceptFriendRequest(requestId.toString());
            setFriendRequests((prev) => prev.filter((req) => req.id !== requestId));
            setFriends((prev) => [...prev, { id: requestId } as UserDTOType]);
        } catch (error) {
            console.error("Error accepting friend request:", error);
        }
    };

    const handleAddFriendByUsername = async (username: string) => {
        try {
            const newFriend = await FriendsApi.getUserByIdOrUsername(username);
            if (newFriend) {
                await FriendsApi.addFriend(newFriend.id.toString());
                setSentRequests((prev) => [...prev, { id: newFriend.id } as UserDTOType]);
            }
        } catch (error) {
            console.error("Error adding friend by username:", error);
        }
    };

    const handleCancelRequest = async (requestId: number) => {
        try {
            await FriendsApi.removeFriend(requestId.toString());
            setSentRequests((prev) => prev.filter((req) => req.id !== requestId));
        } catch (error) {
            console.error("Error canceling friend request:", error);
        }
    };

    const handleDeclineRequest = async (requestId: number) => {
        try {
            await FriendsApi.removeFriend(requestId.toString());
            setFriendRequests((prev) => prev.filter((req) => req.id !== requestId));
        } catch (error) {
            console.error("Error declining friend request:", error);
        }
    };

    return (
        <div className="text-white">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">My Friends</h1>
                <p className="text-gray-400">
                    You have {friends.length} friends
                </p>
            </div>

            <div className="space-y-4 mb-8 bg-gray-900 rounded border border-gray-700">
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
                            <div className="flex gap-2 rounded bg-red-800 p-1">
                                <button
                                    onClick={() => handleRemoveFriend(friend.id)}
                                >
                                    remove friend
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <h2>Friend Request</h2>
                <div>
                    {friendRequests.length > 0 ? (
                        friendRequests.map((request) => (
                            <div
                                key={request.id}
                                className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={request.avatar}
                                            alt={request.username}
                                            className="w-12 h-12 rounded-full ring-2 ring-purple-500/30"
                                        />
                                        <h3 className="text-lg font-semibold text-white">
                                            {request.username}
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => handleAcceptRequest(request.id)}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleDeclineRequest(request.id)}
                                    >
                                        Decline
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>---</p>
                    )}
                </div>
                <h2 className="mt-8">Sent Requests</h2>
                <div>
                    {sentRequests.length > 0 ? (
                        sentRequests.map((request) => (
                            <div
                            key={request.id}
                            className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={request.avatar}
                                            alt={request.username}
                                            className="w-12 h-12 rounded-full ring-2 ring-purple-500/30"
                                            />
                                        <h3 className=" text-lg font-semibold text-white">
                                            {request.username}
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => handleCancelRequest(request.id)}
                                        >
                                        Cancel Request
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>---</p>
                    )}
                </div>

            </div>

            <div className="flex flex-wrap gap-4 justify-center">
                <input
                    type="text"
                    placeholder="Enter username"
                    className="px-4 py-2 border border-white/10 rounded-lg bg-transparent"
                    value={newFriend}
                    onChange={(e) => {
                        if (e.target) setNewFriend((e.target as HTMLInputElement).value);
                    }}
                />
                <button className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                    onClick={() => handleAddFriendByUsername(newFriend)}
                >
                    Add Friend
                </button>
            </div>
        </div>
    );
}
