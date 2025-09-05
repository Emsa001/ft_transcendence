import React from "react";
import { useNavigate } from "react";
import { FaComments, FaUsers, FaBan } from "react-icons/fa";
import { UserDTOType } from "shared";
import { Icon } from "@shared/components/Icon";
import { OtherUserPicture } from "@features/user/ui/UserPicture";
import { useLanguage } from "@features/language/model/useLanguage";

export function UserInfoDisplay({ user }: { user: UserDTOType }) {
    const { getText } = useLanguage();
    const text = getText("profile.playerStats");
    const navigate = useNavigate();

    return (
        <div className="relative w-full h-full text-center">
            <div className="flex justify-center">
                <OtherUserPicture userId={user.id} size={28} />
            </div>
            <h2 className="text-xl font-bold">{user?.username}</h2>
            <p className="text-gray-400">{text}</p>
        </div>
    );
};
