import React from "react";
import ApiService from "../service/api";

export const LogoutButton = ({ onLogout }: { onLogout: () => void }) => {
    const handleLogout = async () => {
        try {
            await ApiService.logout();
            onLogout(); // e.g., setUser(null)
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded">
            Logout
        </button>
    );
};
