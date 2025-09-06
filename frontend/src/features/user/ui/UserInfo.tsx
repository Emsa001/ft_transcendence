import React, { useState, useEffect } from "react";
import { useNavigate } from "react";
import {
    FaComments,
    FaUsers,
    FaBan,
    FaUserFriends,
    FaAddressBook,
    FaUserPlus,
    FaUserMinus,
    FaUserClock,
    FaUserAlt,
    FaUserAltSlash,
    FaUserCog,
    FaRegUser,
    FaUserMd,
    FaUserLock,
    FaUserCircle,
    FaUserSlash,
} from "react-icons/fa";
import { UserDTOType } from "shared";
import { Icon } from "@shared/components/Icon";
import { useUser } from "@features/auth/model/useUser";
import { useLanguage } from "@features/language/model/useLanguage";
import FriendsApi from "../service/friendsApi";
import blockUserApi from "../service/blockUserApi";
import { set } from "lodash";
import { Toast } from "@shared/lib/Toast";

export function UserInfo({ user }: { user: UserDTOType }) {
    const { getText } = useLanguage();
    const text = getText("profile.contactInfo");
    const navigate = useNavigate();
    const [sentRequests, setSentRequests] = useState<UserDTOType[]>([]);
    const [sendedRequest, setSendedRequest] = useState<UserDTOType[]>([]);
    const [isFriend, setIsFriend] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);

    const handleAddFriend = async () => {
        const response = await FriendsApi.addFriend(user.id);
        if (response) {
            setSentRequests([...sentRequests, { id: user.id } as UserDTOType]);
        }
    };

    const handleCancelRequest = async () => {
        await FriendsApi.removeFriend(user.id);
        setSentRequests(sentRequests.filter((req) => req.id !== user.id));
        setIsPending(false);
        Toast.success("Friend request canceled successfully.");
    };

    const handleRemoveFriend = async () => {
        await FriendsApi.removeFriend(user.id);
        setIsFriend(false);
        Toast.success("Friend removed successfully.");
    };

    const handleChat = () => {
        if (isFriend) {
            navigate(`/chat/${user.id}`);
        } else {
            Toast.error("You can only chat with friends.");
        }
    };

    const handleBlockUser = async () => {
        await blockUserApi.blockUser(user.id);
        setIsBlocked(true);
        Toast.success("User has been blocked.");
    };

    const handleUnblockUser = async () => {
        await blockUserApi.unblockUser(user.id);
        setIsBlocked(false);
        Toast.success("User has been unblocked.");
    };

    useEffect(() => {
        const fetchSentRequests = async () => {
            const sent = await FriendsApi.getAllSentRequests();
            if (sent) {
                setSendedRequest(sent);
                if (sent.some((req) => req.id === user.id)) setIsPending(true);
            }
        };

        const fetchFriendStatus = async () => {
            const allFriends = await FriendsApi.getAllFriends();
            if (allFriends) {
                if (allFriends.some((friend) => friend.id === user.id)) {
                    setIsPending(false);
                    setIsFriend(true);
                }
            }
        };

        const fetchBlockStatus = async () => {
            const blockedUsers = await blockUserApi.getAll();
            if (
                blockedUsers &&
                blockedUsers.some((blocked) => blocked.id === user.id)
            )
                setIsBlocked(true);
        };

        fetchSentRequests();
        fetchFriendStatus();
        fetchBlockStatus();
    }, [sentRequests]);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
                <h2 className="text-xl font-bold">{text.title}</h2>
            </div>
            <div className="grid grid-cols-2 items-center">
                <div className="grid grid-rows-2 gap-4">
                    <div>
                        <p className="text-gray-400">{text.username}</p>
                        <p>{user.username}</p>
                    </div>
                    <div>
                        <p className="text-gray-400">{text.userId}</p>
                        <p>{user.id}</p>
                    </div>
                </div>
                <div className="grid grid-cols-3 mt-1 justify-items-center items-center">
                    <Icon
                        icon={FaComments}
                        className={`mx-2 ${isFriend ? "text-purple-400/80" : "text-gray-400/80"}  w-9 h-9 hover:w-10 hover:h-10 hover:cursor-pointer`}
                        onClick={handleChat}
                    />

                    {isPending ? (
                        <Icon
                            icon={FaUserClock}
                            className="mx-2 text-emerald-400/80 w-9 h-9 hover:w-10 hover:h-10 hover:cursor-pointer"
                            onClick={handleCancelRequest}
                        />
                    ) : isFriend ? (
                        <Icon
                            icon={FaUserMinus}
                            className="ml-2 text-amber-500/70 w-9 h-9 hover:w-10 hover:h-10 hover:cursor-pointer"
                            onClick={handleRemoveFriend}
                        />
                    ) : (
                        <Icon
                            icon={FaUserPlus}
                            className="mx-2 text-indigo-300/80 w-9 h-9 hover:w-10 hover:h-10 hover:cursor-pointer"
                            onClick={handleAddFriend}
                        />
                    )}

                    {!isBlocked ? (
                        <Icon
                            icon={FaBan}
                            className="mx-2 text-red-400/70 w-9 h-9 hover:w-10 hover:h-10 hover:cursor-pointer"
                            onClick={handleBlockUser}
                        />
                    ) : (
                        <Icon
                            icon={FaUserSlash}
                            className="mx-2 text-gray-400/70 w-9 h-9 hover:w-10 hover:h-10 hover:cursor-pointer"
                            onClick={handleUnblockUser}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
