export interface User {
    name: string;
    email: string;
    picture?: string;
    sub: string;
}

export interface AuthResponse {
    user: User;
    token?: string;
}
