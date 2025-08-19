import { UserDTOType } from "./user";

export type TournamentUserDTOType = UserDTOType & {
    eliminated: boolean;
};
