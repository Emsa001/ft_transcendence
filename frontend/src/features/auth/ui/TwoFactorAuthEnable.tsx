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
        return <p>Two-Factor Authentication has been successfully enabled.</p>;
    }

    return (
        <div className="border border-1 p-4">
            <h2>Enable Two-Factor Authentication</h2>
            <Button onClick={initiateSetup}>Enable 2FA</Button>

            <div>
                {qrImageUrl && (
                    <div>
                        <img src={qrImageUrl} alt="Scan QR code" width={200} />
                        <Input
                            type="text"
                            value={code}
                            onChange={(e: any) => setCode(e.target.value)}
                            placeholder="Enter 6-digit code"
                        />
                        <Button onClick={handleEnable}>Submit</Button>
                        <p>Scan the QR code with your authenticator app.</p>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};