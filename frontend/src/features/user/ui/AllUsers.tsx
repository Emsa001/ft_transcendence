"use client";
import React, { useEffect, useStatic } from "react";
import { useOnlineUsers } from "../model/useOnlineUsers";

export function AllUsers() {
    const { onlineUsers } = useOnlineUsers();

    return (
        <div className="bg-white/10 rounded-xl p-4 mb-4">
            <h3 className="text-lg font-bold mb-2 text-white">Online Users</h3>
            <ul className="divide-y divide-white/20">
                {onlineUsers.map((user: any) => (
                    <li
                        key={user}
                        className="py-2 flex items-center gap-2 justify-between"
                    >
                        <div>
                            <span className="font-medium text-white">
                                {user}
                            </span>
                        </div>
                        <span className="text-green-400 text-xs">● online</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
