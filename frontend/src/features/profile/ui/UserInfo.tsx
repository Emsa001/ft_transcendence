import { useUser } from "@features/auth/model/useUser";
import { MyPicture } from "@features/user/ui/UserPicture";
import React from "react";

export function UserInfo() {
    const { user } = useUser();

    return (
        <div className="text-center">
            <div className="flex justify-center">
                <MyPicture />
            </div>
            <h2 className="text-xl font-bold">{user?.username}</h2>
            <p className="text-gray-400">Pong Player</p>
        </div>
    );
}
