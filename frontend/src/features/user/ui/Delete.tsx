import React from "react";
import { Button } from "@shared/components/Button";
import ProfileApi from "@features/user/service/profileApi";
import { useUser } from "@features/auth/model/useUser";

interface DeleteButtonProps {
    className?: string;
}

export const DeleteButton = ({ className }: DeleteButtonProps) => {
    const { setUser } = useUser();
    const handleDelete = async () => {
        const isConfirmed = window.confirm(
            "Are you sure you want to delete your account?"
        );
        if (!isConfirmed) return;
        const status = await ProfileApi.deleteUser();
        if (status) {
            setUser(null);
        }
    };

    return (
        <div>
            <Button onClick={handleDelete} color="error" className={className}>
                Delete Account
            </Button>
        </div>
    );
};
