import { User } from "../User/User";
import { TournamentUser } from "./TournamentUser";

export type UserWithTournamentData = User & {
    TournamentUser: TournamentUser;
};
