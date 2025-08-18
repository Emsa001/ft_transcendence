import { Game } from "@/database/models/Game/Game";
import { Tournament } from "@/database/models/Tournaments/Tournament";
import { GameStatus } from "shared";

export class TournamentCreationService {
    static async createAllGames(tournament: Tournament): Promise<Game[]> {
        const maxPlayers = tournament.maxPlayers;

        // For single elimination tournament, we need (n-1) total games
        // where n is the number of players
        const totalGames = maxPlayers - 1;

        // Create all games for the tournament
        for (let i = 0; i < totalGames; i++) {
            await tournament.createGame({
                status: GameStatus.WAITING,
            });
        }

        return await tournament.getGames();
    }
}
