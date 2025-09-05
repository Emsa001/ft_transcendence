import { WebSocket } from "@fastify/websocket";
import { WebSocketService } from "@/lib/WebSocketService";
import { Tournament } from "@/database/models/Tournaments/Tournament";
import { User } from "@/database/models/User/User";
import { GameStatus } from "shared";
import { GameRooms } from "@/modules/game/services/registry.service";
import { HttpException } from "@/utils/exceptions";
import { Game } from "@/database/models/Game/Game";
import { TournamentRooms } from "./registry.service";

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
            const users = await this.tournament.getPlayers();
            let tournamentUser = users.find((p) => p.id === user.id);

            if (!tournamentUser) {
                await this.tournament.addPlayer(user);
                await this.tournament.reload({ include: ["players"] });
                console.log(
                    `Player ${user.username} joined tournament ${this.tournament.uuid}`
                );
                tournamentUser = await this.tournament.players.find(
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

        const players = await this.tournament.getPlayers();
        const user = players.find((p) => p.id === userId);
        if (!user) return;

        const userConnections = this.getClient(userId);
        if (userConnections.length > 1) return;

        await this.tournament.removePlayer(user);

        players.splice(
            players.findIndex((p) => p.id === userId),
            1
        );

        if (players.length === 0) {
            console.log(`Deleting empty tournament ${this.tournament.uuid}`);
            await TournamentRooms.remove(this.tournament.uuid);
            return;
        }

        if (players.length === this.tournament.maxPlayers - 1) {
            GameRooms.triggerHooks("onGameAvailabilityChange", this.tournament);
        }

        await this.tournament.reload();

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
            console.log("Eliminated player", player.username);
        }

        const roundGames: Game[] = await tournament.getGames({
            where: {
                round: game.round,
                status: [
                    GameStatus.LOCKED,
                    GameStatus.WAITING,
                    GameStatus.IN_PROGRESS,
                ],
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
        await this.tournament.reload({ include: ["players"] });
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
