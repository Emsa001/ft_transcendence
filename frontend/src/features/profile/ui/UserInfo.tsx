import { TwoFactorAuthDisable, TwoFactorAuthEnable } from "@features/auth";
import { useAuth } from "@features/auth/model/useAuth";
import { useUser } from "@features/auth/model/useUser";
import { useLanguage } from "@features/language/model/useLanguage";
import { MyPicture } from "@features/user/ui/UserPicture";
import { Icon } from "@shared/components/Icon";
import { Modal } from "@shared/components/Modal";
import React, { useState } from "react";
import { MdOutlineSecurity } from "react-icons/md";
import { CiLogout } from "react-icons/ci";

interface TwoFaModalProps {
    modalOpen: boolean;
    setModalOpen: (open: boolean) => void;
}

const TwoFaModal = ({ modalOpen, setModalOpen }: TwoFaModalProps) => {
    const { user } = useUser();
    if (!user) return <div />;
    return (
        <div className="mt-6">
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <div className="w-full h-full">
                    {user.is2FAEnabled ? (
                        <TwoFactorAuthDisable />
                    ) : (
                        <TwoFactorAuthEnable />
                    )}
                </div>
            </Modal>
        </div>
    );
};

export const UserInfo = () => {
    const { user } = useUser();
    const [modalOpen, setModalOpen] = useState(false);
    if (!user || !user.id) return <div />;
    const { getText } = useLanguage();
    const text = getText("profile.playerStats");
    const { handleLogout } = useAuth();

    return (
        <div className="relative w-full h-full text-center">
            <div className="flex justify-center">
                <MyPicture />
            </div>
            <h2 className="text-xl font-bold">{user?.username}</h2>
            <p className="text-gray-400">{text}</p>
            <div className="absolute top-0 left-0">
                <Icon
                    icon={MdOutlineSecurity}
                    className="text-green-400 w-6 h-6 cursor-pointer hover:text-green-200"
                    onClick={() => setModalOpen(true)}
                />
            </div>
            <div className="absolute top-0 right-0">
                <Icon
                    icon={CiLogout}
                    className="text-red-400 w-6 h-6 cursor-pointer hover:text-red-200"
                    onClick={handleLogout}
                />
            </div>
            <TwoFaModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
        </div>
    );
};
