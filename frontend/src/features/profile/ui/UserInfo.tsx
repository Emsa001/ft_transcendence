import { useUser } from "@features/auth/model/useUser";
import { UserPicture } from "@features/user/ui/UserPicture";
import React from "react";

export function UserInfo() {
    const { user } = useUser();
    if (!user) return <div />;

    return (
        <div className="text-center">
            <div className="flex justify-center">
                <UserPicture
                    userId={user.id.toString()}
                    className="w-28 h-28 rounded-full object-cover border-4 border-blue-400"
                />
            </div>
            <h2 className="text-xl font-bold">{user?.username}</h2>
            <p className="text-gray-400">Pong Player</p>
        </div>
    );
}
