import { useNavigate, useRef, useStatic } from "react";
import { twoFactorAuthAlert, AuthApi } from "../";

export const useAuth = () => {
    // const navigate = useNavigate();
    const ref = useRef<HTMLDivElement | null>(null);
    const [user, setUser] = useStatic<User | null>("user", null);

    const handleCredentialResponse = async (response: google.CredentialResponse) => {
        try {
            const token = response.credential;

            const data = await AuthApi.googleAuth(token);
            if (!data) {
                console.error("Failed to authenticate user with Google.");
                return;
            }

            setUser(data.user);

            if (data.twoFA){
                // navigate("/auth/2fa/verify"); // Uncomment if use a component for 2FA verification
                twoFactorAuthAlert();
            }

        } catch (error) {
            console.error("Error during Google authentication:", error);
        }
    };

    const fetchUser = async () => {
        try {
            const data = await AuthApi.getUser();
            if (!data) {
                console.error("Failed to fetch user data from Google.");
                return;
            }

            setUser(data.user);

            if (data.twoFA){
                // navigate("/auth/2fa/verify");  // Uncomment if use a component for 2FA verification
                twoFactorAuthAlert();
            }

        } catch (error: unknown) {
            if (error instanceof Error && error.message === "2FA_REQUIRED") {
                alert("Two-factor authentication is required. Please complete the setup.");
            }
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

    return {
        fetchUser,
        initializeGoogleSignIn,
        ref,
    };
};
