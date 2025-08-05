interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;

    is2FAEnabled: boolean;
}

interface AuthResponse {
    user: User;
    twoFA: boolean;
}

type Auth2Action = "login" | "enable" | "disable";
