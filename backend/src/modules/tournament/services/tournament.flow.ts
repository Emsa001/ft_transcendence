import { Tournament } from "@/database/models/Tournaments/Tournament";
import { HttpException } from "@/utils/exceptions";
import { GameStatus } from "shared";

export const tournamentExampleRoundFlow = async (tournament: Tournament) => {
    if (tournament.status !== GameStatus.IN_PROGRESS) {
        throw new HttpException(400, "Tournament is not in progress");
    }

    const games = await tournament.getGames({
        where: { status: GameStatus.IN_PROGRESS },
    });

    console.log(
        `Starting round ${tournament.round} with ${games.length} games`
    );

    for (const game of games) {
        const players = await game.getPlayers();
        console.log(
            `Processing game ${game.id} with players: ${game.players.length}`
        );
        console.log(`Players: ${players.map((p) => p.id).join(", ")}`);

        for (const player of players) {
            await game.playerScore(player.id, Math.floor(Math.random() * 10));
        }

        await game.update({ status: GameStatus.FINISHED });

        const eliminated = players.filter((p) => p.id != game.winnerId);
        for (const player of eliminated) {
            await tournament.eliminatePlayer(player.id);
        }
    }

    const activePlayers = await tournament.getActivePlayers();
    if (activePlayers.length === 1) {
        const winner = activePlayers[0];
        tournament.status = GameStatus.FINISHED;
        tournament.winnerId = winner.id;
        await tournament.save();
        console.log(
            `Tournament ${tournament.name} finished. Winner: ${winner.username}`
        );
    }
};
