import React from "react";
import { useLogout } from "../model/useLogout";
import { Button } from "@shared/components/Button";

export const LogoutButton = ({ onLogout }: { onLogout: () => void }) => {
    const { handleLogout } = useLogout({ onLogout });

    return (
        <Button onClick={handleLogout} color="error">
            Logout
        </Button>
    );
};
