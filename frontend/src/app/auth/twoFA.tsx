import { TwoFactorAuthVerify } from "@features/auth";
import React from "react";

/**
 * Two-Factor Authentication Page
 * User would be redirected here after login if 2FA is enabled.
 * TODO: User should be redirected away from this page after successful verification or if already verified.
 */

export default function TwoFA() {
    return (
        <div>
            <TwoFactorAuthVerify />
        </div>
    );
}
