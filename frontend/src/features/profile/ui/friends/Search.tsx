import React, { useEffect, useState } from "react";
import { UserDTOType } from "shared";
import FriendsApi from "../../../user/service/friendsApi";
import { UserPicture } from "@features/user/ui/UserPicture";
import { Modal } from "@shared/components/Modal";
import ProfileApi from "../../../user/service/profileApi";
import { useUser } from "@features/auth/model/useUser";
import { Alert } from "@shared/components/Alert";
import { useLanguage } from "@features/language/model/useLanguage";

interface SearchModalProps {
    onClose: () => void;
    isOpen: boolean;
}

export function SearchModal({ onClose, isOpen }: SearchModalProps) {
    const [query, setQuery] = useState("");
    const { user } = useUser();
    const [results, setResults] = useState<UserDTOType[]>([]);
    const [sentRequests, setSentRequests] = useState<UserDTOType[]>([]);
    const { getText } = useLanguage();
    const texts = getText("profile.friends");

    if (!user) return <div />;

    useEffect(() => {
        if (query.trim() === "") {
            setResults([]);
            return;
        }
        const handler = setTimeout(async () => {
            const sent = await FriendsApi.getAllSentRequests();
            setSentRequests(sent);
            const filtered = await ProfileApi.searchUsers(query);
            const filteredWithoutSelf = filtered.filter(
                (u: UserDTOType) => u.id !== user.id
            );
            setResults(filteredWithoutSelf);
        }, 400);

        return () => clearTimeout(handler);
    }, [query, user.id]);

    const handleSearch = (e: any) => {
        setQuery(e.target.value);
    };

    const handleAddFriend = async (friend: UserDTOType) => {
        const response = await FriendsApi.addFriend(friend.id);
        if (response) {
            setSentRequests([
                ...sentRequests,
                { id: friend.id } as UserDTOType,
            ]);
        }
    };

    const handleCancelRequest = async (friend: UserDTOType) => {
        await FriendsApi.removeFriend(friend.id);
        setSentRequests(sentRequests.filter((req) => req.id !== friend.id));
        Alert.success("Friend request canceled successfully.");
    };

    return (
        <div>
            <Modal isOpen={isOpen} onClose={onClose}>
                <div className="p-6 w-[400px] max-h-[500px] flex flex-col">
                    <h3 className="text-lg font-bold mb-4 text-gray-200">
                        {texts.searchUsers}
                    </h3>
                    <input
                        type="text"
                        value={query}
                        onChange={handleSearch}
                        placeholder={texts.searchByUsername}
                        className="px-3 py-2 mb-4 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 pr-2">
                        {results.length === 0 && query.length > 0 ? (
                            <p className="text-sm text-gray-400">
                                {texts.noUsers}
                            </p>
                        ) : (
                            <div>
                                {results.map((user) => {
                                    const isSent = sentRequests.some(
                                        (req) => req.id === user.id
                                    );
                                    return (
                                        <div
                                            key={user.id}
                                            className="flex items-center justify-between gap-3 py-2 px-3 bg-gray-700/60 hover:bg-gray-700 mb-2 rounded-lg transition"
                                        >
                                            <div className="flex items-center gap-3">
                                                <UserPicture
                                                    userId={user.id}
                                                    className="w-9 h-9 rounded-full"
                                                />
                                                <span className="font-medium text-gray-200">
                                                    {user.username}
                                                </span>
                                            </div>
                                            {isSent ? (
                                                <button
                                                    className="bg-red-500/80 hover:bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium transition"
                                                    onClick={() =>
                                                        handleCancelRequest(
                                                            user
                                                        )
                                                    }
                                                >
                                                    {texts.cancel}
                                                </button>
                                            ) : (
                                                <button
                                                    className="bg-green-500/80 hover:bg-green-500 text-white px-3 py-1 rounded-md text-sm font-medium transition"
                                                    onClick={() =>
                                                        handleAddFriend(user)
                                                    }
                                                >
                                                    {texts.add}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
}
