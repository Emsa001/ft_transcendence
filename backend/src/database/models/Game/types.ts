import { User } from "../User/User";
import { GameUser } from "./GameUser";

export type UserWithGameData = User & {
    GameUser: GameUser;
};
