import { useRef, useStatic } from "react";
import AuthApi from "../api";
import { User } from "../types";

export const useAuth = () => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [user, setUser] = useStatic<User | null>("user", null);

    const handleCredentialResponse = async (response: google.CredentialResponse) => {
        try {
            const token = response.credential;

            const data = await AuthApi.googleAuth(token);
            if (!data || !data.user) {
                console.error("Failed to authenticate user with Google.");
                return;
            }

            setUser(data.user as unknown as User);
        } catch (error) {
            console.error("Error during Google authentication:", error);
        }
    };

    const initializeGoogleSignIn = () => {
        if (!ref.current) {
            console.error("Google Sign-In button reference is null.");
            return;
        }

        const google = window.google?.accounts?.id;
        if (!google) {
            console.error("Google Identity Services not available.");
            return;
        }

        google.initialize({
            client_id: process.env.FT_REACT_PUBLIC_GOOGLE_CLIENT_ID || "",
            callback: handleCredentialResponse,
        });

        google.renderButton(ref.current, {
            theme: "outline",
            size: "large",
        });
    };

    const fetchUser = async () => {
        try {
            const data = await AuthApi.getUser();
            if (!data || !data.user) {
                console.error("Failed to fetch user data from Google.");
                return;
            }

            setUser(data.user as unknown as User);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    return {
        fetchUser,
        initializeGoogleSignIn,
        ref,
    };
};
