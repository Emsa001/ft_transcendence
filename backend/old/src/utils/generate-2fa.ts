import speakeasy from "speakeasy";
import qrcode from "qrcode";

/**
 * Generates a 2FA secret and QR code for a user.
 * @param userEmail - The email of the user to associate with the 2FA secret
 * @returns Promise<{ base32: string, otpauth_url: string, qrImageUrl: string }>
 */

interface TwoFASecret {
    base32: string; // The base32 encoded secret
    otpauth_url: string; // The URL for the OTP Auth app
    qrImageUrl: string; // The QR code image URL
}

export const generate2FASecret = (userEmail: string):Promise<TwoFASecret> => {
    const secret = speakeasy.generateSecret({
        name: `MyApp (${userEmail})`,
    });

    return new Promise((resolve, reject) => {
        qrcode.toDataURL(secret.otpauth_url, (err, qrImageUrl) => {
            if (err) return reject(err);

            resolve({
                base32: secret.base32, // Store this securely (encrypted!)
                otpauth_url: secret.otpauth_url,
                qrImageUrl,
            });
        });
    });
};

/**
 * Verifies a TOTP token against a user's secret.
 * @param secret - The base32 secret stored in the DB
 * @param token - The 6-digit code entered by the user
 * @returns boolean - whether the code is valid
 */
export function verify2FACode(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
        secret,
        encoding: "base32",
        token,
        window: 1, // accept ±30s
    });
}
