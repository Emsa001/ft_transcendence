import { useState } from "react";
import AuthApi from "../api";


export const useTwoFactorAuth = () => {
    const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Start the 2FA setup process (fetch QR code)
    const initiateSetup = async (email: string) => {
        try {
            setError(null);

            const data = await AuthApi.initiate2FASetup(email);
            setQrImageUrl(data.qrImageUrl);
        } catch (err) {
            setError("Failed to initiate 2FA setup");
        }
    };

    // Verify a user-entered 2FA code
    const verifyCode = async (email: string, code: string) => {
        try {
            setError(null);
            
            const data = await AuthApi.verify2FACode(email, code);

            if (!data.success) {
                setError("Invalid code");
                return false;
            }

            return true;
        } catch (err) {
            setError("Verification failed");
            return false;
        }
    };

    const enable2FA = async (email: string, code: string) => {
        try {
            setError(null);

            const data = await AuthApi.enable2FA(email, code);

            if (!data.success) {
                setError("Failed to enable 2FA");
                return false;
            }
            
            return true;
        } catch (err) {
            setError("Failed to enable 2FA");
            return false;
        }
    };

    const disable2FA = async (email: string, code: string) => {
        try {
            setError(null);
            const data = await AuthApi.disable2FA(email, code);
            if (!data.success) {
                setError("Failed to disable 2FA");
                return false;
            }
            return true;
        } catch (err) {
            setError("Failed to disable 2FA");
            return false;
        }
    };

    return {
        qrImageUrl,
        error,
        initiateSetup,
        verifyCode,
        enable2FA,
        disable2FA
    };
};
