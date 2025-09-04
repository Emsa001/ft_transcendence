import {
    GameDTOType,
    GameMode,
    GameStatus,
    GameUserDTOType,
    TournamentUserDTOType,
} from "shared";

export class LocalTournament {
    static getActivePlayers(
        players: TournamentUserDTOType[]
    ): TournamentUserDTOType[] {
        return players.filter((p) => !p.eliminated);
    }

    static createAllGames(playerCount: number): GameDTOType[] {
        const allGames: GameDTOType[] = [];
        let gameIdCounter = Date.now();
        let remainingPlayers = playerCount;
        let currentRound = 1;
        let gameIndex = 0;

        while (remainingPlayers > 1) {
            const nextPowerOfTwo =
                remainingPlayers <= 2
                    ? 2
                    : 2 ** Math.floor(Math.log2(remainingPlayers));
            const excessPlayers = remainingPlayers - nextPowerOfTwo;

            const gamesInRound =
                excessPlayers > 0 ? excessPlayers : remainingPlayers / 2;

            for (let i = 0; i < gamesInRound; i++) {
                allGames.push({
                    id: gameIdCounter + gameIndex,
                    hostId: 0,
                    status: GameStatus.LOCKED,
                    mode: GameMode.NORMAL,
                    players: [],
                    maxPlayers: 2,
                    winner: null,
                    round: currentRound,
                    isPrivate: false,
                    code: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                gameIndex++;
            }

            remainingPlayers =
                excessPlayers > 0 ? nextPowerOfTwo : remainingPlayers / 2;
            currentRound++;
        }

        return allGames;
    }

    static assignPlayersToGames(
        games: GameDTOType[],
        round: number,
        activePlayers: TournamentUserDTOType[]
    ): { updatedGames: GameDTOType[]; gamesForRound: GameDTOType[] } {
        const roundGames = games.filter(
            (game) => game.round === round && game.status === GameStatus.LOCKED
        );

        const nextPowerOfTwo =
            activePlayers.length <= 2
                ? 2
                : 2 ** Math.floor(Math.log2(activePlayers.length));
        const excessPlayers = activePlayers.length - nextPowerOfTwo;

        const playersInThisRound =
            excessPlayers > 0
                ? activePlayers.slice(0, excessPlayers * 2)
                : activePlayers;

        const gamesForRound: GameDTOType[] = [];
        const gamesNeeded = Math.floor(playersInThisRound.length / 2);

        for (let i = 0; i < Math.min(gamesNeeded, roundGames.length); i++) {
            const game = roundGames[i];
            const player1 = playersInThisRound[i * 2];
            const player2 = playersInThisRound[i * 2 + 1];

            game.players = [
                { ...player1, score: 0 } as GameUserDTOType,
                { ...player2, score: 0 } as GameUserDTOType,
            ];
            game.status = GameStatus.IN_PROGRESS;
            game.updatedAt = new Date();

            gamesForRound.push(game);
        }

        const updatedGames = games.map((game) => {
            const updatedGame = gamesForRound.find((g) => g.id === game.id);
            return updatedGame || game;
        });

        return { updatedGames, gamesForRound };
    }

    static canAdvanceToNextRound(games: GameDTOType[]): boolean {
        return (
            games.filter((game) => game.status === GameStatus.IN_PROGRESS)
                .length === 0
        );
    }

    static shouldTournamentEnd(
        activePlayers: TournamentUserDTOType[]
    ): boolean {
        return activePlayers.length <= 1;
    }

    static validateTournamentStart(
        players: TournamentUserDTOType[]
    ): string | null {
        if (players.length < 2) {
            return "At least 2 players are required to start the tournament.";
        }
        return null;
    }

    static validatePlayerAddition(
        players: TournamentUserDTOType[],
        username: string,
        maxPlayers: number,
        status: GameStatus
    ): string | null {
        if (players.length >= maxPlayers) {
            return "Maximum number of players reached.";
        }
        if (status !== GameStatus.WAITING) {
            return "Cannot add players after the tournament has started.";
        }
        if (players.find((p) => p.username === username)) {
            return "Player with this username already exists.";
        }
        return null;
    }
}
