import { User } from "../User/User";
import { Game } from "./Game";

export class GameUserService {
    static async addPlayer(game: Game, user: User): Promise<void> {
        // $add will create the junction table record AND update in-memory array if loaded
        await game.$add('users', user);
    }

    /*
        TODO: Do we need removePlayer method?
        If we create all players only when the game starts,
        we might not need to remove players from the game.
    */
    static async removePlayer(game: Game, user: User): Promise<void> {
        await game.$remove('users', user);
    }

    static async hasPlayer(game: Game, user: User): Promise<boolean> {
        // If users are already loaded, use the in-memory data (no query)
        if (game.users && Array.isArray(game.users)) {
            return game.users.some((u) => u.id === user.id);
        }
        
        return await game.$has('users', user);
    }

    static async getPlayers(game: Game): Promise<User[]> {
        return await game.$get('users') as User[];
    }
}