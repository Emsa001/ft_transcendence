import { useAuth } from "@features/auth/model/useAuth";
import { useUser } from "@features/auth/model/useUser";
import { useLanguage } from "@features/language/model/useLanguage";
import { MyPicture } from "@features/user/ui/UserPicture";
import { Icon } from "@shared/components/Icon";
import React, { useNavigate, useState } from "react";
import { MdOutlineSecurity } from "react-icons/md";
import { CiLogout } from "react-icons/ci";

import { FaRegMessage } from "react-icons/fa6";
import { TwoFaModal } from "@features/auth/ui/TwoFaModal";
import { sliceText } from "@shared/lib/utils";

export const UserInfo = () => {
    const { user } = useUser();
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();
    const { getText } = useLanguage();
    const { handleLogout } = useAuth();
    const text = getText("profile.playerStats");

    if (!user || !user.id) return <div />;

    return (
        <div className="relative w-full h-full text-center">
            <div className="flex justify-center">
                <MyPicture />
            </div>
            <h2 className="text-xl font-bold">
                {sliceText(user.username, 10)}
            </h2>
            <p className="text-gray-400">{text}</p>
            <div className="absolute top-0 left-0 flex flex-col gap-4">
                <Icon
                    icon={MdOutlineSecurity}
                    className={`w-7 h-7 cursor-pointer hover:text-green-200 ${user.is2FAEnabled ? "text-green-400" : "text-gray-400"}`}
                    onClick={() => setModalOpen(true)}
                />
                <Icon
                    icon={CiLogout}
                    className="text-red-400 w-7 h-7 cursor-pointer hover:text-red-200"
                    onClick={handleLogout}
                />
            </div>
            <div className="absolute top-0 right-0">
                <Icon
                    icon={FaRegMessage}
                    className="text-blue-400 w-7 h-7 cursor-pointer hover:text-blue-200"
                    onClick={() => navigate("/chat")}
                />
            </div>
            <TwoFaModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
        </div>
    );
};
