import speakeasy from "speakeasy";
import qrcode from "qrcode";

import { User } from "@/database/models/User/User";
import { HttpException } from "@/utils/exceptions";

import JwtService from "./jwt.service";
import { Token, TwoFaAction, TwoFASecret } from "../auth.types";

class TwoFAService {
    /*
     * TwoFa verify endpoint
     * Returns the user object, session, and response configuration
     * TODO: Cleanup (function too long)
     */
    async verify(
        token: Token,
        code: string,
        action: TwoFaAction = "login"
    ): Promise<{ user: User; session: string; shouldSetCookie: boolean }> {
        const { email, twoFA } = JwtService.verify(token);

        const user = await User.findByEmail(email);
        if (!user) throw new HttpException(401, "Unauthorized: User not found");
        if (!user.twoFASecret)
            throw new HttpException(
                401,
                "Unauthorized: 2FA secret not set for user"
            );

        const isValid = speakeasy.totp.verify({
            secret: user.twoFASecret,
            encoding: "base32",
            token: code,
            window: 1,
        });

        if (!isValid)
            throw new HttpException(401, "Unauthorized: Invalid 2FA code");

        switch (action) {
            case "login":
                if (!user.is2FAEnabled || !twoFA) {
                    throw new HttpException(
                        400,
                        "Bad Request: Two-Factor Authentication is not enabled or already verified for this user"
                    );
                }

                const newToken = JwtService.sign(
                    {
                        email: user.email,
                        twoFA: "disabled",
                    },
                    "1d"
                );

                return {
                    user,
                    session: newToken,
                    shouldSetCookie: true,
                };

            case "enable":
                if (user.is2FAEnabled)
                    throw new HttpException(
                        400,
                        "Bad Request: User already has 2FA enabled"
                    );

                await User.update(
                    { is2FAEnabled: true },
                    { where: { id: user.id } }
                );
                return { user, session: "", shouldSetCookie: false };
            case "disable":
                if (!user.is2FAEnabled)
                    throw new HttpException(
                        400,
                        "Bad Request: User does not have 2FA enabled"
                    );

                user.is2FAEnabled = false;
                user.twoFASecret = null;

                await user.save();

                return { user, session: "", shouldSetCookie: false };
            default:
                throw new HttpException(400, "Bad Request: Invalid action");
        }
    }

    /*
     * Setup 2FA for the user
     * Generates a new 2FA secret and returns the QR code image URL
     */
    async setup(token: Token): Promise<TwoFASecret> {
        const { email } = await JwtService.verify(token);
        const twoFASecret = await this.generate(email);

        // Update the user's twoFASecret
        await User.update(
            { twoFASecret: twoFASecret.base32 },
            { where: { email } }
        );

        return twoFASecret;
    }

    /*
     * Generates a new 2FA secret for the user
     * Returns the secret in base32 format, the otpauth URL, and the QR
     */
    async generate(userEmail: string): Promise<TwoFASecret> {
        const secret = speakeasy.generateSecret({
            name: `ft_transcendence (${userEmail})`,
        });

        return new Promise((resolve, reject) => {
            if (!secret.otpauth_url)
                return reject(new Error("OTPAuth URL is undefined"));

            qrcode.toDataURL(secret.otpauth_url, (err, qrImageUrl) => {
                if (err) return reject(err);

                resolve({
                    base32: secret.base32,
                    otpauth_url: secret.otpauth_url as string,
                    qrImageUrl,
                });
            });
        });
    }
}

const twoFAService = new TwoFAService();
export default twoFAService;
