import React from "react";
import { TwoFactorAuthDisable } from "./TwoFactorAuthDisable";
import { TwoFactorAuthEnable } from "./TwoFactorAuthEnable";
import { Modal } from "@shared/components/Modal";
import { useUser } from "../model/useUser";

interface TwoFaModalProps {
    modalOpen: boolean;
    setModalOpen: (open: boolean) => void;
}

export function TwoFaModal({ modalOpen, setModalOpen }: TwoFaModalProps) {
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
