import { GameStatus } from "shared";
// import { GameStatus } from "../../../../../shared/src/game";
import { User } from "../User/User";
import { Game } from "./Game";
import { GameUser } from "./GameUser";
import { Validators } from "@/database/other/Validators";
import { Tournament } from "../Tournaments/Tournament";

export class GameUserHooks {
    static async verifyAddPlayer(gameUser: GameUser) {
        await Validators.validateGame(gameUser.gameId, 1);
    }

    static async verifyBulkAddPlayer(GameUser: GameUser[]) {
        const gameGroups: Record<number, number> = {};
        for (const gu of GameUser) {
            gameGroups[gu.gameId] = (gameGroups[gu.gameId] || 0) + 1;
        }

        for (const gameIdStr in gameGroups) {
            const gameId = parseInt(gameIdStr, 10);
            await Validators.validateGame(gameId, gameGroups[gameId]);
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

        if (instance.tournamentId) {
            const tournament = await Tournament.findByPk(instance.tournamentId);
            if (!tournament) return;

            const eliminated = instance.players.filter(
                (p) => p.id != winner.id
            );
            for (const player of eliminated) {
                await tournament.eliminatePlayer(player.id);
            }
        }

        await instance.save();
    }
}
