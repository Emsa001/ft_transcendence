export interface UserDTOType {
    id: number;
    email?: string | null;
    username: string;
    avatar: string | null;
    is2FAEnabled?: boolean;
}
export interface UserEditableData {
    username: string;
}

export type TwoFaStatus = "disabled" | "started" | "completed";
export type TwoFaAction = "login" | "enable" | "disable";

export interface JWTPayload {
    id: number;
    twoFA: TwoFaStatus;
}

export interface OAuth2Payload {
    code: string;
    action: TwoFaAction;
}

export interface GetStatisticsResponse {
    tournaments: {
        amount: number;
        wins: number;
        losses: number;
        winRate: number;
    };

    casual: {
        amount: number;
        wins: number;
        losses: number;
        winRate: number;
    };

    total: {
        amount: number;
        wins: number;
        losses: number;
        winRate: number;
    };
}