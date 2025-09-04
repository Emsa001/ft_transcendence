import { TwoFactorAuthDisable, TwoFactorAuthEnable } from "@features/auth";
import { useUser } from "@features/auth/model/useUser";
import { useLanguage } from "@features/language/model/useLanguage";
import { UserPicture } from "@features/user/ui/UserPicture";
import { Icon } from "@shared/components/Icon";
import { Modal } from "@shared/components/Modal";
import React, { useState } from "react";

interface TwoFaModalProps {
    modalOpen: boolean;
    setModalOpen: (open: boolean) => void;
}

function TwoFaModal({ modalOpen, setModalOpen }: TwoFaModalProps) {
    const { user } = useUser();
    if (!user) return <div />;
    return (
        <div className="mt-6">
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                {user.is2FAEnabled ? (
                    <TwoFactorAuthDisable />
                ) : (
                    <TwoFactorAuthEnable />
                )}
            </Modal>
        </div>
    );
}

import { MdOutlineSecurity } from "react-icons/md";
export function UserInfo() {
    const { user } = useUser();
    const [modalOpen, setModalOpen] = useState(false);
    if (!user || !user.id) return <div />;
    const { getText } = useLanguage();
    const text = getText("profile.playerStats");

    return (
        <div className="relative w-full h-full text-center">
            <div className="flex justify-center">
                <UserPicture
                    userId={user.id}
                    className="w-28 h-28 rounded-full border-4 border-blue-400"
                />
            </div>
            <h2 className="text-xl font-bold">{user?.username}</h2>
            <p className="text-gray-400">{text}</p>
            <div className="absolute top-0 left-0">
                <Icon
                    icon={MdOutlineSecurity}
                    className="text-gray-400 w-6 h-6 cursor-pointer hover:text-gray-200"
                    onClick={() => setModalOpen(true)}
                />
            </div>
            <TwoFaModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
        </div>
    );
}
