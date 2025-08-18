import { TwoFaStatus, UserDTOType } from "shared";

export type User = UserDTOType;

export interface AuthResponse {
    user: User;
    twoFA: TwoFaStatus;
}

type Auth2Action = "login" | "enable" | "disable";
