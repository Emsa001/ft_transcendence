import React from "react";
import { UserDTOType } from "shared";
import FriendsApi from "../../../user/service/friendsApi";
import { UserPicture } from "@features/user/ui/UserPicture";
import { useLanguage } from "@features/language/model/useLanguage";

interface MyFriendsProps {
    friends: UserDTOType[];
    setFriends: (friends: UserDTOType[]) => void;
}

export function MyFriends({ friends, setFriends }: MyFriendsProps) {
    const { getText } = useLanguage();
    const texts = getText("profile.friends");

    const handleRemoveFriend = async (friend: UserDTOType) => {
        await FriendsApi.removeFriend(friend.id);
        setFriends(friends.filter((f) => f.id !== friend.id));
    };

    return (
        <div>
            {friends.map((user: UserDTOType) => (
                <li
                    key={user.id}
                    className="flex items-center justify-between gap-3 py-3 px-2 bg-gray-700/50 hover:bg-gray-700 mb-2 rounded-lg transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <UserPicture
                            userId={user.id}
                            size={8} 
                            className="w-9 h-9 rounded-full"
                        />
                        <span className="font-medium text-gray-200">
                            {user.username}
                        </span>
                    </div>

                    <button
                        className="bg-red-500/80 hover:bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium transition"
                        onClick={() => handleRemoveFriend(user)}
                    >
                        {texts.remove}
                    </button>
                </li>
            ))}
        </div>
    );
}
