import { Game } from "@/database/models/Game/Game";
import { User } from "@/database/models/User/User";
import { HttpException } from "@/utils/exceptions";

export class UserGamesService {
    static async getHistory(user: User | number): Promise<Game[]> {
        if (typeof user === "number") {
            const temp = await User.findByPk(user);
            if (!temp) throw new HttpException(404, "User not found");
            user = temp;
        }

        const games = await user.getGames();
        return games;
    }
}
