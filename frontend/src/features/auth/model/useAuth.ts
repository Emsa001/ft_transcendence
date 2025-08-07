import { useRef, useStatic } from "react";
import { twoFactorAuthAlert, AuthApi } from "../";

export const useAuth = () => {
    // const navigate = useNavigate();
    const ref = useRef<HTMLDivElement | null>(null);
    const [user, setUser] = useStatic<User | null>("user", null);

    const googleSignIn = () => {
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
            callback: googleSignInCallback,
        });

        google.renderButton(ref.current, {
            theme: "outline",
            size: "large",
        });
    };

    const googleSignInCallback = async (response: google.CredentialResponse) => {
        const token = response.credential;

        const user = await AuthApi.googleAuth(token);
        if (!user) {
            console.error("Failed to authenticate user with Google.");
            return;
        }

        setUser(user);

        if(user.is2FAEnabled) twoFactorAuthAlert();
    };

    /**
     * Is based on a session cookie, returns {user, twoFA}
     * twoFA is true if is required
     */
    const fetchUser = async () => {
        try {
            const data = await AuthApi.getAuthSession();
            if (!data) {
                console.error("Failed to fetch user data from Google.");
                return;
            }

            setUser(data.user);

            if (data.twoFA == "started") twoFactorAuthAlert();
        } catch (error: unknown) {
            if (error instanceof Error && error.message === "2FA_REQUIRED") {
                alert("Two-factor authentication is required. Please complete the setup.");
            }
        }
    };

    return {
        googleSignIn,
        fetchUser,
        ref,
    };
};
