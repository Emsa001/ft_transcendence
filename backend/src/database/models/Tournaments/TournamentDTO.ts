import {
    GameDTOType,
    GameStatus,
    TournamentDTOType,
    TournamentUserDTOType,
} from "shared";
import { Tournament } from "./Tournament";

export class TournamentDTO implements TournamentDTOType {
    id: number;
    name: string;
    status: GameStatus;
    players: TournamentUserDTOType[];
    games?: GameDTOType[];
    round: number;
    maxScore: number;
    maxPlayers: number;
    winner: string | null;
    uuid: string;
    hostId: number | null;
    randomEvents: boolean;
    createdAt: Date;
    updatedAt: Date;

    private tournament: Tournament;

    constructor(tournament: Tournament) {
        this.id = tournament.id;
        this.name = tournament.name || `Tournament ${tournament.id}`;
        this.status = tournament.status;
        this.round = tournament.round;
        this.maxPlayers = tournament.maxPlayers;
        this.maxScore = tournament.maxScore;
        this.players = tournament.players.map((player) => ({
            ...player.toDTO(),
            eliminated: player.TournamentUser.eliminated,
        }));
        this.winner = tournament.winnerId
            ? tournament.players.find((p) => p.id === tournament.winnerId)
                  ?.username || null
            : null;
        this.uuid = tournament.uuid;
        this.hostId = tournament.hostId;
        this.tournament = tournament;
        this.randomEvents = tournament.randomEvents;
        this.createdAt = tournament.createdAt;
        this.updatedAt = tournament.updatedAt;

        Object.defineProperty(this, "tournament", {
            value: tournament,
            writable: true,
            enumerable: false,
            configurable: true,
        });
    }

    async withGames(): Promise<TournamentDTO> {
        this.games = (await this.tournament.getGames()).map((game) =>
            game.toDTO()
        );
        return this;
    }

    toString(): string {
        return `
            ID: ${this.id}
            Name: ${this.name}
            Status: ${this.status}
            Round: ${this.round}
            Max Players: ${this.maxPlayers}
            Players: ${this.players.map((player) => player.username).join(", ")}
            Games: ${this.games?.map((game) => game.id).join(", ")}
        `;
    }
}
