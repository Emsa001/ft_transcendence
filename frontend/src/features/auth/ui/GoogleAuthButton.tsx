import React, { useEffect } from "react";
import { useAuth } from "../model/useAuth";

export const GoogleAuthButton = () => {
    const { fetchUser, googleSignIn, ref } = useAuth();

    useEffect(() => {
        fetchUser();
        // Wait until the script is loaded
        const interval = setInterval(() => {
            if (window.google && window.google.accounts) {
                clearInterval(interval);
                googleSignIn();
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return <div ref={ref} />;
};
