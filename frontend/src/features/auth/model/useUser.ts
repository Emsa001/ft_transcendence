import { useState, useStatic } from "react";
import { AuthApi, twoFactorAuthAlert } from "..";

export const useUser = () => {
    const [user, setUser] = useStatic<User | null>("user", null);
    const [loading, setLoading] = useStatic<boolean>("user_loading", true); // TODO: is needed?

    const fetchUser = async () => {
        setLoading(true);
        try {
            const data = await AuthApi.getAuthSession();
            if (!data) throw new Error("Failed to fetch user session");

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
