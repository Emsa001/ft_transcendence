import React, { useState, useEffect } from "react";
import FriendsApi from "@features/user/service/friendsApi";
import { UserDTOType } from "shared";
import { useFriends } from "./context";
import { OtherUserPicture } from "@features/user/ui/UserPicture";

export function ReceivedRequests() {
    const { friends, setFriends } = useFriends();
    const [receivedRequests, setReceivedRequests] = useState<UserDTOType[]>([]);

    useEffect(() => {
        FriendsApi.getFriendRequests().then((requests) => {
            if (requests) setReceivedRequests(requests);
        });
    }, []);

    const handleAcceptRequest = async (requestId: number) => {
        try {
            await FriendsApi.acceptFriendRequest(requestId);
            setReceivedRequests((prev) =>
                prev.filter((req) => req.id !== requestId)
            );
            setFriends((prev: UserDTOType[]) => [
                ...prev,
                { id: requestId } as UserDTOType,
            ]);
        } catch (error) {}
    };

    const handleDeclineRequest = async (requestId: number) => {
        try {
            await FriendsApi.removeFriend(requestId);
            setReceivedRequests((prev) =>
                prev.filter((req) => req.id !== requestId)
            );
        } catch (error) {}
    };

    return (
        <div className="p-5 my-4 bg-white/10 rounded-xl flex-1 overflow-y-auto ">
            <h2>Received Requests</h2>
            <div>
                {receivedRequests.map((request) => (
                    <div
                        key={request.id}
                        className="bg-white/5 rounded-lg p-1 border border-white/10 
                                hover:bg-white/10 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <OtherUserPicture
                                    userId={request.id}
                                    size={8}
                                />
                                <h3 className="text-lg font-semibold text-white">
                                    {request.username}
                                </h3>
                            </div>
                            <button
                                onClick={() => handleAcceptRequest(request.id)}
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => handleDeclineRequest(request.id)}
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
