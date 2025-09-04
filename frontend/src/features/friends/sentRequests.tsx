import React, { useState, useNavigate, useEffect } from "react";
import FriendsApi from "@features/user/service/friendsApi";
import { UserDTOType } from "shared";
import { useFriends } from "./context";
import { OtherUserPicture } from "@features/user/ui/UserPicture";


export function SentRequests() {
    const { sentRequests, setSentRequests } = useFriends();

    useEffect(() => {
        const fetchSentRequests = async () => {
            try {
                const allSentRequests = await FriendsApi.getAllSentRequests();
                setSentRequests(allSentRequests);
            } catch (error) {
                console.error("Error fetching sent friend requests:", error);
            }
        };
        fetchSentRequests();
    }, []);

    const handleCancelRequest = async (requestId: number) => {
        try {
            await FriendsApi.removeFriend(requestId);
            setSentRequests((prev: UserDTOType[]) =>
                prev.filter((req) => req.id !== requestId)
            );
        } catch (error) {
            console.error("Error canceling friend request:", error);
        }
    };

    return (
        <div className="p-4 my-4 ml-2 overflow-y-auto bg-white/10 rounded-xl flex-1">
            <h2 className="">Sent Requests</h2>
            <div>
                {sentRequests.map((request: UserDTOType) => (
                    <div
                        key={request.id}
                        className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <OtherUserPicture userId={request.id} />
                                <h3 className=" text-lg font-semibold text-white">
                                    {request.username}
                                </h3>
                            </div>
                            <button
                                onClick={() => handleCancelRequest(request.id)}
                            >
                                Cancel Request
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
