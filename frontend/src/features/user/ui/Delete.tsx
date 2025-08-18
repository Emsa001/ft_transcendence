import React, { useNavigate } from "react";
import { Button } from "@shared/components/Button";
import ProfileApi from "@features/user/service/profileApi";

export const DeleteButton = () => {
    const navigate = useNavigate();

    const handleDelete = async () => {
        const isConfirmed = window.confirm(
            "Are you sure you want to delete your account?"
        );

        if (!isConfirmed) return;

        try {
            await ProfileApi.deleteUser();
            navigate("/");
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div>
            <Button onClick={handleDelete} color="error">
                Delete Account
            </Button>
        </div>
    );
};
