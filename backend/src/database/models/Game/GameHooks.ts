import { GameStatus } from "shared";
import { User } from "../User/User";
import { Game } from "./Game";
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

export class GameHooks {
    static async setGameWinner(instance: Game) {
        if (instance.status !== GameStatus.FINISHED) return;

        await instance.reload({
            include: [{ model: User, as: "players" }],
        });

        if (instance.players.length < 1) return;

        const winner = instance.players.reduce((prev, current) => {
            return prev.GameUser.score > current.GameUser.score
                ? prev
                : current;
        });

        instance.winnerId = winner.id;
        await instance.save();
    }
}
