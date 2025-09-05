import React, { useState, useNavigate, useEffect } from "react";
import { useUser } from "@features/auth/model/useUser";
import FriendsApi from "@features/user/service/friendsApi";
import { UserDTOType } from "shared";
import { useFriends } from "./context";


export function FindNewFriends() {
    const { user } = useUser();
    const { setSentRequests } = useFriends();

    const [newFriend, setNewFriend] = useState<string>("");
    const [userNotFound, setUserNotFound] = useState<string>("");

    const handleAddFriendByUsername = async (username: string) => {
        try {
            const newFriend = await FriendsApi.getUserByIdOrUsername(username);
            if (newFriend) {
                await FriendsApi.addFriend(newFriend.id);
                setSentRequests((prev: UserDTOType[]) => [
                    ...prev,
                    {
                        username: newFriend.username,
                        id: newFriend.id,
                    } as UserDTOType,
                ]);
                setUserNotFound(`friend request sent to ${newFriend.username}`);
            }
        } catch (error) {
            setUserNotFound(`User not found or already added`);
            console.error(`Error adding friend by username: ${newFriend}`, error);
        }
    };

    return (
        <div className="flex-1 text-center">
            <div className="flex flex-wrap flex-1 gap-4 justify-center">

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleAddFriendByUsername(newFriend);
                    }}
                >
                    <input
                        type="text"
                        placeholder="Enter username"
                        className="px-4 py-2 border border-white/10 rounded-lg bg-transparent"
                        value={newFriend}
                    onChange={(e) => {
                        if (e.target)
                            setNewFriend((e.target as HTMLInputElement).value);
                    }}
                />
                </form>

                <button
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                    onClick={() => handleAddFriendByUsername(newFriend)}
                >
                    Add Friend
                </button>
            </div>

            {userNotFound && (
                <p className={`${
                        userNotFound === `friend request sent to ${newFriend}`
                            ? "text-green-500"
                            : "text-red-500"
                    }`}>
                    {userNotFound}
                </p>
            )}
        </div>
    );
}
