import React, { useState, useNavigate } from "react";
import {
    LogoutButton,
    TwoFactorAuthDisable,
    TwoFactorAuthEnable,
} from "@features/auth";
import { useUser } from "@features/auth/model/useUser";

export default function Friends() {

    const { user } = useUser();

    // fake friends data
    const fakeFriends = [
        { id: 12, name: "Emanuella Scura", status: "online", avatar: "https://via.placeholder.com/50" },
        { id: 4, name: "Tobias Riedel", status: "offline", avatar: "https://via.placeholder.com/50" },
        { id: 5, name: "Bequ Beqa", status: "online", avatar: "https://via.placeholder.com/50" },
        { id: 7, name: "Emma Watson", status: "offline", avatar: "https://via.placeholder.com/50" },
        { id: 2, name: "Paulo Beckhausa", status: "online", avatar: "https://via.placeholder.com/50" },
    ];

    if (!user || typeof user !== 'object') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white flex items-center justify-center">
                <div className="text-2xl">Loading...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">My Friends</h1>
                <p className="text-gray-400">You have {fakeFriends.length} friends</p>
            </div>

            <div className="space-y-4 mb-8">
                {fakeFriends.map((friend) => (
                    <div key={friend.id} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img
                                        src={friend.avatar}
                                        alt={friend.name}
                                        className="w-12 h-12 rounded-full ring-2 ring-purple-500/30"
                                    />
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black ${
                                        friend.status === "online" ? "bg-green-500" :
                                        friend.status === "away" ? "bg-yellow-500" : "bg-gray-500"
                                    }`}></div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{friend.name}</h3>
                                    <p className="text-sm text-gray-400 capitalize">{friend.status}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm">
                                    Message
                                </button>
                                <button className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors text-sm">
                                    Game
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
                <button className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                    Add Friend
                </button>
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                    Find Players
                </button>
            </div>
        </div>
    );
}