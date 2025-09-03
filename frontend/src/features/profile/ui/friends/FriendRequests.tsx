import React from "react";
import { UserDTOType } from "shared";
import FriendsApi from "../../../user/service/friendsApi";
import { UserPicture } from "@features/user/ui/UserPicture";
import { Alert } from "@shared/components/Alert";

interface FriendRequestsProps {
    friendRequests: UserDTOType[];
    setFriendRequests: (friendRequests: UserDTOType[]) => void;
    setFriends: (friends: UserDTOType[]) => void;
    friends: UserDTOType[];
}

export function FriendRequests({
    friendRequests,
    setFriendRequests,
    setFriends,
    friends,
}: FriendRequestsProps) {
    const handleAcceptFriendRequest = async (friend: UserDTOType) => {
        await FriendsApi.acceptFriendRequest(friend.id);
        setFriendRequests(friendRequests.filter((f) => f.id !== friend.id));
        setFriends([...friends, friend]);
        Alert.success("Friend request accepted.");
    };

    const handleRejectFriendRequest = async (friend: UserDTOType) => {
        await FriendsApi.removeFriend(friend.id);
        setFriendRequests(friendRequests.filter((f) => f.id !== friend.id));
        Alert.success("Friend request rejected.");
    };

    return (
        <div className="mb-6">
            {friendRequests.map((user: UserDTOType) => (
                <li
                    key={user.id}
                    className="flex items-center justify-between gap-3 py-3 px-2 bg-gray-700/60 hover:bg-gray-700 mb-2 rounded-lg transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <UserPicture
                            userId={user.id}
                            className="w-9 h-9 rounded-full object-cover"
                        />
                        <span className="font-medium text-gray-200">
                            {user.username}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded-md text-sm font-medium transition"
                            onClick={() => handleAcceptFriendRequest(user)}
                        >
                            Accept
                        </button>
                        <button
                            className="bg-red-500/80 hover:bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium transition"
                            onClick={() => handleRejectFriendRequest(user)}
                        >
                            Reject
                        </button>
                    </div>
                </li>
            ))}
        </div>
    );
}
