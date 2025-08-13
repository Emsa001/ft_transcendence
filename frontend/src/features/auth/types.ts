interface User {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    is2FAEnabled: boolean;
}

interface AuthResponse {
    user: User;
    twoFA: "disabled" | "started" | "completed";
}

type Auth2Action = "login" | "enable" | "disable";
