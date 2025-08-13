import React, { useState } from "react";
import AuthApi from "../service/api";
import Swal from "sweetalert2";

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
                Swal.showValidationMessage(
                    `Code is invalid or expired. ${code}`
                );
            }
        },
    });
};
