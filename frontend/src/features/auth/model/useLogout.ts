import { useStatic } from "react";
import { AuthApi } from "../";

export const useLogout = ({ onLogout }: { onLogout: () => void }) => {
    const [user, setUser] = useStatic<google.User | null>("user", null);

    const handleLogout = async () => {
        try {
            await AuthApi.logout();
            setUser(null);
            onLogout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return { handleLogout };
};
