import React from "react";
import { UserDTOType } from "shared/dist";

export function Head({ user }: { user: UserDTOType }) {
    return (
        <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-xl glass-border">
                <span className="text-xl font-bold">{user.username}</span>
            </div>
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight">
                    {user.username}
                </h1>
                <p className="text-sm text-purple-200">
                    Transcendence • "Player"
                </p>
            </div>
        </div>
    );
}
