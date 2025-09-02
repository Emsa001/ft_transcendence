import React from "react";
import { Button } from "@shared/components/Button";
import { useAuth } from "../model/useAuth";

type LogoutButtonProps = {
    className?: string;
};

export const LogoutButton = ({ className }: LogoutButtonProps) => {
    const { handleLogout } = useAuth();

    return (
        <div>
            <Button className={className} onClick={handleLogout} color="error">
                Logout
            </Button>
        </div>
    );
};
