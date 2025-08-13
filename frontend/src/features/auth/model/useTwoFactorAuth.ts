import { useState } from "react";
import { AuthApi } from "../";
import Swal from "sweetalert2";

// Hook for verifying 2FA code after login
export const useVerify2FACode = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const verifyCode = async (code: string) => {
        if (loading) return;

        try {
            setLoading(true);
            setError(null);

            const success = await AuthApi.verify2FACode(code, "login");

            if (!success) {
                setError("Invalid code");
            }

            Swal.fire({
                title: "Success",
                text: "Two-Factor Authentication successful.",
                icon: "success",
            });
        } catch (err) {
            setError("Verification failed");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        verifyCode,
    };
};

// Hook for enabling 2FA
export const useEnable2FA = () => {
    const [error, setError] = useState<string | null>(null);
    const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);

    const initiateSetup = async () => {
        try {
            setError(null);
            const data = await AuthApi.initiate2FASetup();
            setQrImageUrl(data.qrImageUrl);
        } catch (err) {
            setError("Failed to initiate 2FA setup");
        }
    };

    const enable2FA = async (code: string) => {
        try {
            setError(null);

            const success = await AuthApi.verify2FACode(code, "enable");

            if (!success) {
                setError("Failed to enable 2FA");
                return false;
            }

            return true;
        } catch (err) {
            setError("Failed to enable 2FA");
            return false;
        }
    };

    return {
        error,
        enable2FA,
        qrImageUrl,
        initiateSetup,
    };
};

// Hook for disabling 2FA
export const useDisable2FA = () => {
    const [error, setError] = useState<string | null>(null);

    const disable2FA = async (code: string) => {
        try {
            setError(null);

            const success = await AuthApi.verify2FACode(code, "disable");

            if (!success) {
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
        error,
        disable2FA,
    };
};
