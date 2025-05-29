export interface User {
    id: string;
    name: string;
    email: string;
    picture?: string;

    is2FAEnabled: boolean;
}

export interface AuthResponse {
    user: User;
    token?: string;
}
