import { useNavigate, useState } from "react";
import { twoFactorAuthAlert, AuthApi } from "../";
import { useUser } from "./useUser";
import { useOnlineUsers } from "@features/user/model/useOnlineUsers";

export const useAuth = () => {
    const { setUser } = useUser();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const { unsubscribeFromOnline } = useOnlineUsers();

    const handleLogout = async () => {
        try {
            await AuthApi.logout();
            unsubscribeFromOnline();
            navigate("/");

            /* 
                Don't ask question, useStatic is just stupid and does rerenders differently, that's why we need to timeout it to avoid conflicts between rerenders (I'll try to fix it)
                TODO: Fix If not too lazy
            */
            setTimeout(() => {
                setUser(null);
            }, 0);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    /**
     * Redirect to Google OAuth2 authorization URL
     */
    const redirectToGoogleAuth = async () => {
        try {
            const response = await AuthApi.getGoogleAuthUrl();
            if (response?.authUrl) {
                window.location.href = response.authUrl;
            } else {
                console.error("Failed to get Google auth URL");
            }
        } catch (error) {
            console.error("Error redirecting to Google auth:", error);
        }
    };

    /**
     * Handle OAuth2 callback parameters from URL
     * Should be called on auth page load to check for callback parameters
     */
    const handleOAuthCallback = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const success = urlParams.get("success");
        const error = urlParams.get("error");
        const require2fa = urlParams.get("require2fa");

        if (error) {
            console.error("OAuth error:", error);
            // Handle different error types
            switch (error) {
                case "access_denied":
                    alert("Access denied. Please try again.");
                    break;
                case "auth_failed":
                    alert("Authentication failed. Please try again.");
                    break;
                case "no_code":
                    alert("No authorization code received.");
                    break;
                default:
                    alert(`Authentication error: ${error}`);
            }
            // Clean up URL
            window.history.replaceState(
                {},
                document.title,
                window.location.pathname
            );
            return;
        }

        if (success === "true") {
            if (require2fa === "true") twoFactorAuthAlert();

            // Clean up URL
            window.history.replaceState(
                {},
                document.title,
                window.location.pathname
            );
            return;
        }
    };

    const handleUsernameLogin = async (username: string, password: string) => {
        try {
            const data = await AuthApi.login(username, password);
            setUser(data);
        } catch (error: any) {
            console.log(error.response);
            setError(
                error.response.data.message || "Login failed. Try again later"
            );
        }
    };

    const handleUsernameRegister = async (
        username: string,
        password: string,
        confirmPassword: string
    ) => {
        try {
            if (password !== confirmPassword) {
                setError("Passwords do not match");
                return;
            }

            let data = await AuthApi.register(username, password);
            setUser(data);
        } catch (error: any) {
            setError(
                error.response.data.message ||
                    "Registration failed. Try again later"
            );
        }
    };

    return {
        handleLogout,
        redirectToGoogleAuth,
        handleOAuthCallback,
        handleUsernameLogin,
        handleUsernameRegister,
        error,
        setError,
    };
};
