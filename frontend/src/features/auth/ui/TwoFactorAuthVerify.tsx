import React, { useState } from "react";
import AuthApi from "../service/api";
import Swal from "sweetalert2";
import { useVerify2FACode } from "../model/useTwoFactorAuth";
import { Button } from "@shared/components/Button";

/*

There are two options to ask user to verify their 2FA code:
1. Use a Dialog (I use SweetAlert2)
2. Use a Form

I think Dialog option is more user-friendly and way easier to maintain.
You can show it anywhere, and doesn't require a separate component.

Form option is more complex, but allows for more customization.
Would require a seperate component and page.

For now I use dialog option, but leave code for both

*/

/**
 * Show a SweetAlert2 dialog for 2FA verification
 * @returns void
 */
export const twoFactorAuthAlert = async () => {
    Swal.fire({
        title: "Two-Factor Authentication Required",
        input: "text",
        inputAttributes: {
            autocapitalize: "off",
        },
        inputOptions: {
            maxLength: 6,
        },
        confirmButtonText: "Verify",
        showLoaderOnConfirm: true,
        allowEscapeKey: false,
        showDenyButton: false,
        showCancelButton: false,
        allowOutsideClick: false,
        preConfirm: async (code) => {
            const isValidCode = await AuthApi.verify2FACode(code, "login");
            if (isValidCode) {
                Swal.fire({
                    title: "Success",
                    text: "Two-Factor Authentication successful.",
                    icon: "success",
                });
            } else {
                Swal.showValidationMessage(`Code is invalid or expired. ${code}`);
            }
        },
    });
};

/**
 *
 * @returns A React component for Two-Factor Authentication
 */
export const TwoFactorAuthVerify = () => {
    const [code, setCode] = useState("");
    const { verifyCode, error } = useVerify2FACode();

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Two-Factor Authentication</h1>
            <p className="mb-6 text-gray-600">Please enter the code sent to your device.</p>
            <form onSubmit={verifyCode} className="space-y-4">
                <input
                    type="text"
                    placeholder="Enter 2FA code"
                    maxLength={6}
                    value={code}
                    onChange={(e: any) => setCode(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                    type="submit"
                    className={`w-full py-2 px-4 rounded-md text-white font-semibold transition`}
                >
                    Verify
                </Button>
            </form>
            {error && <div className="mt-4 text-red-600 font-medium">{error}</div>}
        </div>
    );
};
