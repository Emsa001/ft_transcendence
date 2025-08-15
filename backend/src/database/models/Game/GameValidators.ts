import { GameStatus } from "shared";
import { Game } from "./Game";
import { GameUser } from "./GameUser";

export class GameValidators {
    /**
     * Validates if we can add a certain number of players to a game
     * @param gameId - the ID of the game
     * @param additionalPlayers - number of players we are trying to add
     */
    static async validateGameState(
        gameId: number,
        additionalPlayers = 1
    ): Promise<void> {
        const game = await Game.findByPk(gameId);
        if (!game) throw new Error("Game not found");

        if (game.status !== GameStatus.WAITING)
            throw new Error("Cannot add players to a game that is not waiting");

        const currentPlayersCount = await GameUser.count({
            where: { gameId: gameId },
        });

        if (currentPlayersCount + additionalPlayers > game.maxPlayers)
            throw new Error("Maximum number of players reached");
    }
}
