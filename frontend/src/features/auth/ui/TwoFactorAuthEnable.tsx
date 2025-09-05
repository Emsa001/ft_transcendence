import React, { useState } from "react";
import { Button } from "@shared/components/Button";
import { Input } from "@shared/components/Input";
import { useEnable2FA } from "../model/useTwoFactorAuth";

/**
 * Component for enabling Two-Factor Authentication
 */
export const TwoFactorAuthEnable = () => {
    const { initiateSetup, enable2FA, qrImageUrl, error } = useEnable2FA();

    const [success, setSuccess] = useState<boolean>(false);
    const [code, setCode] = useState("");

    const handleEnable = async () => {
        const result = await enable2FA(code);
        if (result) {
            setSuccess(true);
            setCode("");
        }
    };

    if (success) {
        return (
            <div className="text-center">
                <h2 className="text-xl font-semibold text-purple-400 mb-4">
                    Two-Factor Authentication Enabled
                </h2>
            </div>
        );
    }

    return (
        <div className="backdrop-blur-lg rounded-2xl shadow-lg text-white">
            <h2 className="text-xl font-semibold text-pink-400 mb-4">
                Enable Two-Factor Authentication
            </h2>
            <button
                className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl shadow-md"
                onClick={initiateSetup}
            >
                Generate QR Code
            </button>

            {qrImageUrl && (
                <div className="mt-6 space-y-3">
                    <img
                        src={qrImageUrl}
                        alt="Scan QR code"
                        className="mx-auto border-2 border-pink-400 rounded-lg"
                        width={200}
                    />
                    <Input
                        type="text"
                        value={code}
                        onChange={(e: any) => setCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        className="w-full p-2 rounded-lg border border-purple-500 bg-black/30 text-pink-200 placeholder-pink-400 focus:ring-2 focus:ring-pink-500"
                    />
                    <button
                        className="p-2 mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl"
                        onClick={handleEnable}
                    >
                        Submit
                    </button>
                    <p className="text-sm text-purple-300">
                        Scan with your authenticator app.
                    </p>
                    {error && <p className="text-red-400">{error}</p>}
                </div>
            )}
        </div>
    );
};
