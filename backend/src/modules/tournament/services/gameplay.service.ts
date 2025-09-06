import { Tournament } from "@/database/models/Tournaments/Tournament";
import { HttpException } from "@/utils/exceptions";
import { GameStatus } from "shared";

export class TournamentGamePlayService {
    static async eliminatePlayer(
        tournament: Tournament,
        playerId: number
    ): Promise<void> {
        const player = await tournament
            .getPlayers()
            .then((players) => players.find((p) => p.id === playerId));
        if (!player) throw new Error("Player not found in tournament");

        // Mark player as eliminated
        await player.TournamentUser.update({ eliminated: true });
    }

    // Test method to simulate a round of gameplay
    static async exampleRoundFlow(
        tournament: Tournament,
        winner?: number
    ): Promise<void> {
        if (tournament.status !== GameStatus.IN_PROGRESS) {
            throw new HttpException(400, "Tournament is not in progress");
        }

        const games = await tournament.getGames({
            where: { status: GameStatus.WAITING },
        });

        for (const game of games) {
            const players = await game.getPlayers();
            await game.update({ status: GameStatus.IN_PROGRESS });

            for (const player of players) {
                await game.playerScore(
                    player.id,
                    Math.floor(Math.random() * 10)
                );
                if (winner && player.id === winner) {
                    await game.playerScore(player.id, 50);
                }
            }

            await game.end();

            const eliminated = (await game.getPlayers()).filter(
                (p) => p.id != game.winnerId
            );
            for (const player of eliminated) {
                await tournament.eliminatePlayer(player.id);
            }
        }

        // TODO: There is smarter way check if it's last round
        const activePlayers = await tournament.getActivePlayers();
        if (activePlayers.length === 1) await tournament.end();
    }
}
