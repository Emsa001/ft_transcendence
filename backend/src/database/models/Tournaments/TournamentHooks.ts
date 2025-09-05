import { Validators } from "@/database/other/Validators";
import { Tournament } from "./Tournament";
import { TournamentUser } from "./TournamentUser";

export class TournamentUserHooks {
    static async verifyAddPlayer(tournamentUser: TournamentUser) {
        await Validators.validateTournament(tournamentUser.tournamentId, 1);
    }

    static async verifyBulkAddPlayer(tournamentUsers: TournamentUser[]) {
        const tournamentGroups: Record<number, number> = {};
        for (const tu of tournamentUsers) {
            tournamentGroups[tu.tournamentId] =
                (tournamentGroups[tu.tournamentId] || 0) + 1;
        }

        for (const tournamentIdStr in tournamentGroups) {
            const tournamentId = parseInt(tournamentIdStr, 10);
            await Validators.validateTournament(
                tournamentId,
                tournamentGroups[tournamentId]
            );
        }
    }

    static async setTournamentHost(tournamentId: number, userIds: number[]) {
        const tournament = await Tournament.findByPk(tournamentId);
        if (!tournament) return;

        console.log("Checking tournament host...");
        if (tournament.hostId && !userIds.includes(tournament.hostId)) return;

        if (tournament.players.length > 0) {
            tournament.hostId = tournament.players[0].id;
            console.log(
                `Host left tournament ${tournament.uuid}, new host is ${tournament.hostId}`
            );
            await tournament.save();
        }
    }
}

export class TournamentHooks {
    static async beforeCreateTournament(tournament: Tournament): Promise<void> {
        if (!tournament.name)
            tournament.name = `Tournament ${(await Tournament.count()) + 1}`;
        if (tournament.maxPlayers <= 0) tournament.maxPlayers = 16;
    }
}
