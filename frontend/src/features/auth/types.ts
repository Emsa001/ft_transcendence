interface User {
    id: string;
    name: string;
    email: string;
    picture?: string;

    is2FAEnabled: boolean;
}

interface AuthResponse {
    user: User;
    twoFA: boolean;
}

type Auth2Action = "login" | "enable" | "disable";
