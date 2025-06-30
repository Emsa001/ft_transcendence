export type Token = string | undefined;
export type Auth2Action = 'login' | 'enable' | 'disable';

export interface TwoFASecret {
    base32: string; // The base32 encoded secret
    otpauth_url: string; // The URL for the OTP Auth app
    qrImageUrl: string; // The QR code image URL
}
