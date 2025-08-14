import { GameUser } from "./GameUser";
import { GameValidators } from "./GameValidators";

export class GameUserHooks {
    static async verifyAddPlayer(gameUser: GameUser) {
        await GameValidators.validateGameState(gameUser.gameId, 1);
    }

    static async verifyBulkAddPlayer(GameUser: GameUser[]) {
        const gameGroups: Record<number, number> = {};
        for (const gu of GameUser) {
            gameGroups[gu.gameId] = (gameGroups[gu.gameId] || 0) + 1;
        }

        for (const gameIdStr in gameGroups) {
            const gameId = parseInt(gameIdStr, 10);
            await GameValidators.validateGameState(gameId, gameGroups[gameId]);
        }
    }
}
