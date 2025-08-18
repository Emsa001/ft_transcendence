import React, { useState, useNavigate } from "react";
import {
    LogoutButton,
    TwoFactorAuthDisable,
    TwoFactorAuthEnable,
} from "@features/auth";

import { useUser } from "@features/auth/model/useUser";


export default function ProfileCard() {

    const { user } = useUser();

    if (!user || typeof user !== 'object') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white flex items-center justify-center">
                <div className="text-2xl">Loading...</div>
            </div>
        );
    }
    

    return (
        <div>
            <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4">
                        <img
                            src={user.avatar}
                            alt="User Avatar"
                            className="w-32 h-32 rounded-full ring-4 ring-purple-500/30 shadow-2xl"
                        />
                        <button className="absolute border border-purple-600 bottom-0.5 right-0 bg-black text-purple-600 hover:bg-purple-600 hover:text-black rounded-full p-1 px-2 m-1 duration-100">
                            Edit
                        </button>
                </div>
                <div className="flex flex-row justify-center items-center gap-2 mb-4">
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    <LogoutButton />
                </div>
            </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <label className="text-sm text-gray-400">User-ID</label>
                        <div className="flex justify-between items-center">
                            <span className="text-lg">{user.id}</span>
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <label className="text-sm text-gray-400">Name</label>
                        <div className="flex justify-between items-center">
                            <span className="text-lg">{user.name}</span>
                            <button className="border rounded-full p-1 px-2 text-pink-400 hover:text-black hover:bg-pink-400 transition-colors">Edit</button>
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <label className="text-sm text-gray-400">Email</label>
                        <div className="flex justify-between items-center">
                            <span className="text-lg pr-3">{user.email}</span>
                            <button className="border rounded-full p-1 px-2 text-pink-400 hover:text-black hover:bg-pink-400 transition-colors">Edit</button>
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <label className="text-sm text-gray-400">Username</label>
                        <div className="flex justify-between items-center">
                            <span className="text-lg pr-3">test-username</span>
                            <button className="border rounded-full p-1 px-2 text-pink-400 hover:text-black hover:bg-pink-400 transition-colors">Edit</button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mb-4">
                    {user?.is2FAEnabled ? <TwoFactorAuthDisable /> : <TwoFactorAuthEnable />}
                </div>
         </div>
    );
}
