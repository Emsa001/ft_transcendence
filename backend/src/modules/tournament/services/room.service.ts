import { WebSocket } from "@fastify/websocket";
import { WebSocketService } from "@/lib/WebSocketService";
import { Tournament } from "@/database/models/Tournaments/Tournament";
import { User } from "@/database/models/User/User";
import { GameStatus } from "shared";
import { GameRooms } from "@/modules/game/services/registry.service";
import { HttpException } from "@/utils/exceptions";
import { Game } from "@/database/models/Game/Game";

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
            let tournamentUser = this.tournament.players.find(
                (p) => p.id === user.id
            );

            if (!tournamentUser) {
                await this.tournament.addPlayer(user);
                await this.tournament.reload({ include: ["players"] });
                console.log(
                    `Player ${user.username} joined tournament ${this.tournament.uuid}`
                );
                tournamentUser = this.tournament.players.find(
                    (p) => p.id === user.id
                );
                if (!tournamentUser)
                    throw new HttpException(
                        501,
                        "Failed to add player to tournament"
                    );
            }

            if (this.tournament.status === GameStatus.WAITING) {
                this.broadcast({
                    type: "PLAYER_JOINED",
                    player: tournamentUser.toDTO().gameUser(),
                });
            }

            this.addClient(user.id, connection);
            this.updateState(connection);
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

    async removePlayer(userId: number) {
        if (this.tournament.status !== GameStatus.WAITING) return;

        const user = this.tournament.players.find((p) => p.id === userId);
        if (!user) return;

        const userConnections = this.getClient(userId);
        if (userConnections.length > 1) return;

        await this.tournament.removePlayer(user);
        await this.tournament.reload({ include: ["players"] });

        if (this.tournament.players.length === 0) {
            await GameRooms.remove(this.tournament.uuid);
            return;
        }

        if (this.tournament.players.length === this.tournament.maxPlayers - 1) {
            GameRooms.triggerHooks("onGameAvailabilityChange", this.tournament);
        }

        this.broadcast({
            type: "PLAYER_DISCONNECTED",
            player: user.toDTO().gameUser(),
            host: this.tournament.hostId,
        });
    }

    async start() {
        if (this.tournament.status !== GameStatus.WAITING) {
            throw new HttpException(400, "Tournament already started");
        }
        if (this.tournament.players.length < 2) {
            throw new HttpException(
                400,
                "Not enough players to start the tournament"
            );
        }

        await this.tournament.start();
        await this.tournament.startRound();

        this.broadcast({
            type: "TOURNAMENT_STARTED",
            host: this.tournament.hostId,
        });

        this.updateState();
    }

    async onGameEnd(game: Game) {
        const tournament = await Tournament.findByPk(game.tournamentId);
        if (!tournament) return;
        if (tournament.status != GameStatus.IN_PROGRESS) return;

        const eliminated = game.players.filter((p) => p.id != game.winnerId);
        for (const player of eliminated) {
            await tournament.eliminatePlayer(player.id);
        }

        const roundGames: Game[] = await tournament.getGames({
            where: {
                round: game.round,
                status: GameStatus.LOCKED,
            },
        });

        this.broadcast({
            type: "GAME_UPDATE",
            game: game.toDTO(),
        });

        if (roundGames.length === 0) {
            await tournament.startRound();
            this.tournament = tournament;
            await this.updateState();
        }
    }

    async updateState(client?: WebSocket) {
        const payload = {
            type: "STATE_UPDATE",
            state: await this.tournament.toDTO().withGames(),
        };
        if (client) this.sendToClient(client, payload);
        else this.broadcast(payload);
    }

    protected async onClientDisconnect(connection: WebSocket) {
        const userId = this.getUserId(connection);
        if (!userId) return;

        await this.removePlayer(userId);
    }
}
