import React from "react";
import { useLogout } from "../model/useLogout";

export const LogoutButton = ({ onLogout }: { onLogout: () => void }) => {
    const { handleLogout } = useLogout({ onLogout });

    return (
        <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded">
            Logout
        </button>
    );
};
