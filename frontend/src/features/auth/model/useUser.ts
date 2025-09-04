import { useEffect, useNavigate, useStatic } from "react";
import { AuthApi, twoFactorAuthAlert } from "..";
import { User } from "../types";

export const useUser = (force?: boolean) => {
    const navigate = useNavigate();
    const [user, setUser] = useStatic<User | null>("user", null);
    const [loading, setLoading] = useStatic<boolean>("user_loading", true); // TODO: is needed?

    useEffect(() => {
        if (force && !user && !loading) {
            navigate("/auth");
        }
    }, [user, loading]);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const data = await AuthApi.getAuthSession();
            if (!data) throw new Error("Failed to fetch user session");

            if (JSON.stringify(data.user) != JSON.stringify(user))
                setUser(data.user);
            if (data.twoFA === "started") twoFactorAuthAlert();
        } catch (err: unknown) {
            if (err instanceof Error && err.message === "2FA_REQUIRED") {
                alert("Two-factor authentication is required.");
            } else {
                console.error(err);
            }
        }

        setLoading(false);
    };

    return {
        user,
        setUser,
        fetchUser,
        loading,
    };
};
