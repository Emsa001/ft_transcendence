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
        return <p>Two-Factor Authentication has been successfully disabled.</p>;
    }

    return (
        <div className="border border-1 p-4">
            <h2>Disable Two-Factor Authentication</h2>
            <Input
                type="text"
                value={code}
                onChange={(e: any) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
            />
            <Button onClick={handleDisable}>Disable 2FA</Button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};
