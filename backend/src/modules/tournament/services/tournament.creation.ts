import { Game } from "@/database/models/Game/Game";
import { Tournament } from "@/database/models/Tournaments/Tournament";
import { HttpException } from "@/utils/exceptions";
import { GameStatus } from "shared";

// https://www.geeksforgeeks.org/aptitude/puzzle-single-elimination-tournament/

// TODO: clean
export class TournamentCreationService {
    static async start(tournament: Tournament): Promise<void> {
        if (tournament.status != GameStatus.WAITING) {
            throw new HttpException(400, "Tournament is not in waiting status");
        }

        // check for enough players
        const players = await tournament.getPlayers();
        if (players.length < 2) {
            throw new HttpException(
                400,
                "Not enough players to start a tournament"
            );
        }

        tournament.status = GameStatus.IN_PROGRESS;
        await tournament.save();
    }

    static async end(tournament: Tournament): Promise<void> {
        const activePlayers = await tournament.getActivePlayers();
        if (activePlayers.length != 1)
            throw new HttpException(
                400,
                "Tournament cannot be ended, there is no winner"
            );

        tournament.status = GameStatus.FINISHED;
        const winner = activePlayers[0];
        tournament.winnerId = winner.id;
        await tournament.save();
    }

    static async createRound(tournament: Tournament): Promise<Game[]> {
        if (tournament.status !== GameStatus.IN_PROGRESS) {
            throw new HttpException(400, "Tournament is not in progress");
        }

        // Check if there are any games currently in progress
        const gamesInProgress = await tournament.getGames({
            where: { status: GameStatus.IN_PROGRESS },
        });

        if (gamesInProgress.length > 0)
            throw new HttpException(400, "Current round is not finished yet");

        const players = await tournament.getActivePlayers();
        const games: Game[] = [];

        // nearest lower power of two
        const nearestPowerOfTwo = 2 ** Math.floor(Math.log2(players.length));
        const excessPlayers = players.length - nearestPowerOfTwo;

        let playersInThisRound: typeof players;
        let byes: typeof players = [];

        if (excessPlayers > 0) {
            // select players for preliminary matches
            const numToPlay = excessPlayers * 2;
            playersInThisRound = players.slice(0, numToPlay);
            byes = players.slice(numToPlay);
        } else {
            playersInThisRound = players;
        }

        // create games for this round
        for (let i = 0; i < playersInThisRound.length; i += 2) {
            const player1 = playersInThisRound[i];
            const player2 = playersInThisRound[i + 1];

            const game = await tournament.createGame({
                status: GameStatus.WAITING,
                hostId: player1.id, // arbitrary
            });

            if (player1) await game.addPlayer(player1);
            if (player2) await game.addPlayer(player2);

            games.push(game);
            await game.update({ status: GameStatus.IN_PROGRESS });
        }

        tournament.round++;
        await tournament.save();

        return games;
    }
}
