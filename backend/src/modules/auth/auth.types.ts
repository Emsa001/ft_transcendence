export type Token = string | undefined;
export type Provider = "google" | "email";

export interface TwoFASecret {
    base32: string; // The base32 encoded secret
    otpauth_url: string; // The URL for the OTP Auth app
    qrImageUrl: string; // The QR code image URL
}

export interface UserLogin {
    username: string;
    password: string;
}
