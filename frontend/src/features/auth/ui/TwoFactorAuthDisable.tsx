import React, { useState } from "react";
import { Button } from "@shared/components/Button";
import { Input } from "@shared/components/Input";
import { useDisable2FA } from "../model/useTwoFactorAuth";

/**
 * Component for disabling Two-Factor Authentication
 */
export const TwoFactorAuthDisable = () => {
    const { disable2FA, error } = useDisable2FA();

    const [code, setCode] = useState("");
    const [success, setSuccess] = useState<boolean>(false);

    const handleDisable = async () => {
        const result = await disable2FA(code);
        if (result) {
            setSuccess(true);
            setCode("");
        }
    };

    if (success) {
        return (
            <div className="text-center">
                <h2 className="text-xl font-semibold text-purple-400 mb-4">
                    Two-Factor Authentication Disabled
                </h2>
            </div>
        );
    }

    return (
        <div className=" backdrop-blur-lg rounded-2xl shadow-lg text-white">
            <h2 className="text-xl font-semibold text-purple-400 mb-4">
                Disable Two-Factor Authentication
            </h2>
            <Input
                type="text"
                value={code}
                onChange={(e: any) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full p-2 rounded-lg border border-pink-500 bg-black/30 text-pink-200 placeholder-pink-400 focus:ring-2 focus:ring-purple-500"
            />
            <button
                className="p-2 mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl"
                onClick={handleDisable}
            >
                Disable 2FA
            </button>
            {error && <p className="text-red-400 mt-2">{error}</p>}
        </div>
    );
};
