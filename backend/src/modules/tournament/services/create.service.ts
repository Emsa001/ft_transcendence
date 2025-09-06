// src/modules/tournament/services/tournament-creation.service.ts
import { Game } from "@/database/models/Game/Game";
import { Tournament } from "@/database/models/Tournaments/Tournament";
import { GameRooms } from "@/modules/game/services/registry.service";
import { HttpException } from "@/utils/exceptions";
import { GameStatus } from "shared";

// Mirrors the frontend TournamentEngine semantics:
// - Pre-create ALL games with status = LOCKED, tagged with round
// - When a round starts, assign players into its LOCKED games, set IN_PROGRESS, create rooms
export class TournamentCreationService {
    static async start(tournament: Tournament): Promise<void> {
        if (tournament.status !== GameStatus.WAITING) {
            throw new HttpException(400, "Tournament is not in waiting status");
        }

        const players = await tournament.getPlayers();
        if (players.length < 2) {
            throw new HttpException(
                400,
                "Not enough players to start a tournament"
            );
        }

        tournament.status = GameStatus.IN_PROGRESS;
        tournament.round = 0;
        await tournament.save();
        await this.createGames(tournament);
    }

    static async end(tournament: Tournament): Promise<void> {
        const activePlayers = await tournament.getActivePlayers();
        if (activePlayers.length !== 1) {
            throw new HttpException(
                400,
                "Tournament cannot be ended, there is no winner"
            );
        }

        tournament.status = GameStatus.FINISHED;
        tournament.winnerId = activePlayers[0].id;
        await tournament.save();
    }

    /** Pre-create the entire bracket in LOCKED state, tagged by round (no rooms yet). */
    static async createGames(tournament: Tournament): Promise<Game[]> {
        await tournament.reload({ include: ["players"] });

        const allGames: Game[] = [];
        let remainingPlayers = tournament.players.length;
        let currentRound = 1;

        while (remainingPlayers > 1) {
            const nextPowerOfTwo =
                remainingPlayers <= 2
                    ? 2
                    : 2 ** Math.floor(Math.log2(remainingPlayers));
            const excessPlayers = remainingPlayers - nextPowerOfTwo;

            const gamesInRound =
                excessPlayers > 0 ? excessPlayers : remainingPlayers / 2;

            for (let i = 0; i < gamesInRound; i++) {
                const game = await tournament.createGame({
                    isPrivate: true,
                    status: GameStatus.LOCKED, // locked until players get assigned
                    hostId: null, // set when assigning
                    maxScore: tournament.maxScore,
                    randomEvents: tournament.randomEvents,
                    round: currentRound,
                });
                allGames.push(game);
            }

            remainingPlayers =
                excessPlayers > 0 ? nextPowerOfTwo : remainingPlayers / 2;
            currentRound++;
        }

        return allGames;
    }

    /** Assigns players to LOCKED games of `round` and starts those games (IN_PROGRESS + rooms). */
    static async startRound(tournament: Tournament): Promise<Game[]> {
        if (tournament.status !== GameStatus.IN_PROGRESS) {
            throw new HttpException(400, "Tournament is not in progress");
        }

        const games: Game[] = await tournament.getGames({
            where: {
                status: [GameStatus.LOCKED],
            },
        });

        if (games.length === 0) {
            await this.end(tournament);
            console.log("Tournament ended, no more games to start");
            return [];
        }

        await tournament.increment("round");
        await tournament.reload();

        console.log(
            `Starting round ${tournament.round} of tournament ${tournament.id}`
        );
        const roundGames = games.filter((g) => g.round === tournament.round);
        if (roundGames.length === 0) return [];

        console.log(
            `Found ${roundGames.length} games to start in round ${tournament.round}`
        );
        const activePlayers = await tournament.getActivePlayers(); // already filtered by eliminated=false
        activePlayers.sort(() => Math.random() - 0.5);

        const nextPowerOfTwo =
            activePlayers.length <= 2
                ? 2
                : 2 ** Math.floor(Math.log2(activePlayers.length));
        const excessPlayers = activePlayers.length - nextPowerOfTwo;

        // players that must play now (others get a bye)
        const playersInThisRound =
            excessPlayers > 0
                ? activePlayers.slice(0, excessPlayers * 2)
                : activePlayers;

        const gamesNeeded = Math.floor(playersInThisRound.length / 2);
        const gamesToStart = Math.min(gamesNeeded, roundGames.length);

        const startedGames: Game[] = [];

        for (let i = 0; i < gamesToStart; i++) {
            const game = roundGames[i];
            await game.update({ status: GameStatus.WAITING });

            const p1 = playersInThisRound[i * 2];
            const p2 = playersInThisRound[i * 2 + 1];

            // assign players
            if (p1) await game.addPlayer(p1);
            if (p2) await game.addPlayer(p2);

            game.hostId = p1?.id ?? game.hostId ?? null;
            await game.save();

            // only create a room when the game actually starts
            await GameRooms.create(game);

            startedGames.push(game);
        }

        return startedGames;
    }
}
