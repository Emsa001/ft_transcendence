import { GameStatus } from "shared";
import { Game } from "./Game";
import { User } from "../User/User";
import { Tournament } from "../Tournaments/Tournament";
import { TournamentRooms } from "@/modules/tournament/services/registry.service";

export class GameService {
    static async end(instance: Game) {
        await instance.reload({
            include: [{ model: User, as: "players" }],
        });
        instance.status = GameStatus.FINISHED;

        if (instance.players.length < 1) return;

        const winner = instance.players.reduce((prev, current) => {
            return prev.GameUser.score > current.GameUser.score
                ? prev
                : current;
        });

        instance.winnerId = winner.id;
        await instance.save();

        const tournament = await Tournament.findByPk(instance.tournamentId);
        if (!tournament) return;
        if (tournament.status != GameStatus.IN_PROGRESS) return;
        TournamentRooms.get(tournament.uuid)?.onGameEnd(instance);
    }
}
