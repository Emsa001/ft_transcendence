import { WebSocket } from "@fastify/websocket";
import { WebSocketService } from "@/lib/WebSocketService";
import { Tournament } from "@/database/models/Tournaments/Tournament";
import { User } from "@/database/models/User/User";

/**
 * Handles the lifecycle of a tournament room and its players.
 */
export class TournamentRoom extends WebSocketService {
    tournament: Tournament;

    constructor(tournament: Tournament) {
        super();
        this.tournament = tournament;
    }

    async addPlayer(connection: WebSocket, user: User) {
        try {
        } catch (error) {
            console.error(
                `Error adding player to tournament ${this.tournament.uuid}:`,
                error
            );
            this.sendToClient(connection, {
                type: "error",
                message: (error as Error).message,
            });
            connection.close();
        }
    }
}
