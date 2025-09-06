import React, {
    useState,
    useNavigate,
    useEffect,
    useContext,
    createContext,
} from "react";
import { useUser } from "@features/auth/model/useUser";
import { FriendsList } from "./friendList";
import { ReceivedRequests } from "./receivedRequests";
import { SentRequests } from "./sentRequests";
import { FindNewFriends } from "./findNewFriends";
import { useContextHook } from "react/hooks/useContext";
import { FriendsProvider } from "./context";

export default function Friends() {
    const { user } = useUser();

    if (!user || typeof user !== "object") {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white flex items-center justify-center">
                <div className="text-2xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            <FriendsProvider>
                <div className="flex flex-col h-full w-full text-white p-1 ">
                    <div className="grow-[1]">
                        <FindNewFriends />
                    </div>

                    <div className="grow-[2]">
                        <FriendsList />
                    </div>

                    <div className="flex flex-row grow-[3]">
                        <ReceivedRequests />
                        <SentRequests />
                    </div>
                </div>
            </FriendsProvider>
        </div>
    );
}
