import { GameStatus } from "shared";
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

    static async setGameHost(gameId: number, userIds: number[]) {
        const game = await Game.findByPk(gameId);
        if (!game) return;

        if (game.hostId && !userIds.includes(game.hostId)) return;

        if (game.players.length > 0) {
            game.hostId = game.players[0].id;
            console.log(
                `Host left game ${game.code}, new host is ${game.hostId}`
            );
            await game.save();
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

    static async generateGameCode(instance: Game) {
        if (instance.code) return;

        let unique = false;
        while (!unique) {
            instance.code = Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase();
            unique = !(await Game.findOne({ where: { code: instance.code } }));
        }
    }
}
