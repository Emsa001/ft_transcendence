import React, { useEffect, useState } from "react";
import { UserDTOType } from "shared";
import FriendsApi from "../../user/service/friendsApi";
import { UserPicture } from "@features/user/ui/UserPicture";
import { Modal } from "@shared/components/Modal";
import ProfileApi from "../../user/service/profileApi";

interface SearchModalProps {
    onClose: () => void;
    isOpen: boolean;
}

export function SearchModal({ onClose, isOpen }: SearchModalProps) {
    const [query, setQuery] = useState("");
    const [allUsers, setAllUsers] = useState<UserDTOType[]>([]);
    const [results, setResults] = useState<UserDTOType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const users = await ProfileApi.getAllUsers();
            setAllUsers(users);
        };
        fetchData();
    }, []);

    const handleSearch = (e: any) => {
        const value = e.target.value;
        setQuery(value);
        if (value.trim() === "") {
            setResults([]);
            return;
        }
        const filtered = allUsers.filter((user) =>
            user.username.toLowerCase().includes(value.toLowerCase())
        );
        setResults(filtered);
    };

    const handleAddFriend = async (friendId: number) => {
        await FriendsApi.addFriend(friendId);
    };

    return (
        <div>
            <Modal isOpen={isOpen} onClose={onClose}>
                <div className="p-6 w-[400px] max-h-[500px] flex flex-col">
                    <h3 className="text-lg font-bold mb-4 text-gray-200">
                        Search Users
                    </h3>
                    <input
                        type="text"
                        value={query}
                        onChange={handleSearch}
                        placeholder="Search by username..."
                        className="px-3 py-2 mb-4 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 pr-2">
                        {results.length === 0 && query.length > 0 ? (
                            <p className="text-sm text-gray-400">
                                No users found.
                            </p>
                        ) : (
                            results.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between gap-3 py-2 px-3 bg-gray-700/60 hover:bg-gray-700 mb-2 rounded-lg transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <UserPicture
                                            userId={user.id.toString()}
                                            className="w-9 h-9 rounded-full object-cover"
                                        />
                                        <span className="font-medium text-gray-200">
                                            {user.username}
                                        </span>
                                    </div>
                                    <button
                                        className="bg-green-500/80 hover:bg-green-500 text-white px-3 py-1 rounded-md text-sm font-medium transition"
                                        onClick={() => handleAddFriend(user.id)}
                                    >
                                        Add
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
}
