interface User {
    id: string;
    name: string;
    email: string;
    picture?: string;

    is2FAEnabled: boolean;
}

interface AuthResponse {
    user: User;
    token?: string;
}

type Auth2Action = 'login' | 'enable' | 'disable';
