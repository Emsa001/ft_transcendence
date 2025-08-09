export type Token = string | undefined;
export type Provider = 'google' | 'email';

export interface TwoFASecret {
    base32: string; // The base32 encoded secret
    otpauth_url: string; // The URL for the OTP Auth app
    qrImageUrl: string; // The QR code image URL
}

// This is session token saved in cookies
export interface JWTPayload {
    email: string;
    twoFA: "disabled" | "started" | "completed";
}

export type TwoFaAction = 'login' | 'enable' | 'disable';
export interface OAuth2Payload {
    code: string;
    action: TwoFaAction;
}

// User Auth

export interface UserLogin {
    email: string;
    password: string;
}

export interface UserRegister extends UserLogin {
    name: string;
}
