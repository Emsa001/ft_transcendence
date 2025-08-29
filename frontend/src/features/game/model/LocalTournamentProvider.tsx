import React, {
    createContext,
    useContext,
    useEffect,
    useLocalStorage,
    useState,
} from "react";
import {
    GameDTOType,
    GameMode,
    GameStatus,
    TournamentUserDTOType,
    GameUserDTOType,
    TournamentDTOType,
} from "shared";

type StatusMessage = {
    message: string;
    success: boolean;
};

type LocalTournamentContextType = {
    status: GameStatus;
    players: TournamentUserDTOType[];
    games: GameDTOType[];
    round: number;
    winnerId: number | null;
    maxPlayers: number;
    setStatus: (status: GameStatus) => void;
    setPlayers: (
        players:
            | TournamentUserDTOType[]
            | ((prev: TournamentUserDTOType[]) => TournamentUserDTOType[])
    ) => void;
    setGames: (games: GameDTOType[]) => void;
    setRound: (round: number | ((prev: number) => number)) => void;
    setWinner: (gameId: number, winnerUsername: string) => void;
    startTournament: () => void;
    endTournament: () => void;
    addPlayer: (username: string) => StatusMessage;
    removePlayer: (username: string) => void;
    createRound: () => GameDTOType[];
    getActivePlayers: () => TournamentUserDTOType[];
    currentGame: GameDTOType | null;
    setCurrentGame: (game: GameDTOType | null) => void;
    playGame: () => void;
    deleteTournament: () => void;
};

// Create context with undefined as default (will throw error if used outside provider)
const LocalTournamentContext = createContext<
    LocalTournamentContextType | undefined
>(undefined);

interface LocalTournamentProviderProps {
    children?: ReactNode;
    maxPlayers?: number;
}

export const LocalTournamentProvider = ({
    children,
    maxPlayers = 16,
}: LocalTournamentProviderProps) => {
    const [tournamentData, setTournamentData] =
        useLocalStorage<TournamentDTOType | null>("localTournament", null);

    const [tournamentId, setTournamentId] = useState<number>(Date.now());
    const [status, setStatus] = useState<GameStatus>(GameStatus.WAITING);
    const [players, setPlayers] = useState<TournamentUserDTOType[]>([]);
    const [round, setRound] = useState(1);
    const [winnerId, setWinnerId] = useState<number | null>(null);

    const [games, setGames] = useState<GameDTOType[]>([]);
    const [currentGame, setCurrentGame] = useState<GameDTOType | null>(null);

    useEffect(() => {
        if (tournamentData != null && tournamentId != tournamentData?.id)
            return;

        const data = {
            id: tournamentId,
            status,
            players,
            games,
            round,
        };

        console.log("Saving tournament data", data);

        setTournamentData(data as TournamentDTOType);
    }, [status, games, round]);

    useEffect(() => {
        if (tournamentData) {
            setTournamentId(tournamentData.id);
            setStatus(tournamentData.status);
            setPlayers(tournamentData.players);
            setGames(tournamentData.games ?? []);
            setRound(tournamentData.round);
        }
    }, []);

    const deleteTournament = () => {
        setStatus(GameStatus.WAITING);
        setPlayers([]);
        setGames([]);
        setRound(1);
        setWinnerId(null);
        setCurrentGame(null);

        setTournamentData(null);
    };

    // --- Utility functions ---
    const getActivePlayers = () => players.filter((p) => !p.eliminated);

    // --- Game creation ---
    const createAllGames = (playerCount: number): GameDTOType[] => {
        const allGames: GameDTOType[] = [];
        let gameIdCounter = Date.now();

        // Calculate total number of games needed for a single elimination tournament
        // For n players, we need n-1 games to eliminate all but one player
        const totalGamesNeeded = playerCount - 1;

        for (let i = 0; i < totalGamesNeeded; i++) {
            const game: GameDTOType = {
                id: gameIdCounter + i,
                status: GameStatus.LOCKED,
                mode: GameMode.NORMAL,
                players: [],
                winner: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            allGames.push(game);
        }

        return allGames;
    };

    // --- Tournament actions ---
    const startTournament = () => {
        console.log(players, round);

        if (players.length < 2) {
            alert("At least 2 players are required to start the tournament.");
            return;
        }

        // Create all games for the tournament upfront
        const totalGames = createAllGames(players.length);
        setGames(totalGames);
        setStatus(GameStatus.IN_PROGRESS);
    };

    const endTournament = () => {
        const activePlayers = getActivePlayers();
        if (activePlayers.length !== 1) {
            alert(
                "Tournament cannot be ended. There should be exactly one winner."
            );
            return;
        }
        setWinnerId(activePlayers[0].id);
        setStatus(GameStatus.FINISHED);
    };

    const addPlayer = (username: string): StatusMessage => {
        if (players.length >= maxPlayers) {
            return {
                message: "Maximum number of players reached.",
                success: false,
            };
        }

        if (status !== GameStatus.WAITING) {
            return {
                message: "Cannot add players after the tournament has started.",
                success: false,
            };
        }

        if (players.find((p) => p.username === username)) {
            return {
                message: "Player with this username already exists.",
                success: false,
            };
        }

        const newPlayer = {
            id: Date.now() + Math.floor(Math.random() * 10000),
            username,
            eliminated: false,
        } as TournamentUserDTOType;

        setPlayers((prev) => [...prev, newPlayer]);
        return { message: `${username} added successfully.`, success: true };
    };

    const removePlayer = (username: string) => {
        if (status !== GameStatus.WAITING) {
            alert("Cannot remove players after the tournament has started.");
            return;
        }
        setPlayers((prev) => prev.filter((p) => p.username !== username));
    };

    // --- Round creation ---
    const createRound = (): GameDTOType[] => {
        if (status !== GameStatus.IN_PROGRESS) {
            alert("Tournament is not in progress.");
            return [];
        }

        const gamesInProgress = games.filter(
            (game) => game.status == GameStatus.IN_PROGRESS
        );

        if (gamesInProgress.length > 0) {
            alert(
                "Cannot create a new round while there are games in progress."
            );
            return [];
        }

        const activePlayers = getActivePlayers();

        if (activePlayers.length <= 1) {
            alert("Cannot create a new round. Tournament should be finished.");
            return [];
        }

        // Get available locked games
        const lockedGames = games.filter(
            (game) => game.status === GameStatus.LOCKED
        );

        if (lockedGames.length === 0) {
            alert("No more games available for this round.");
            return [];
        }

        // nearest lower power of two
        const nearestPowerOfTwo =
            2 ** Math.floor(Math.log2(activePlayers.length));
        const excessPlayers = activePlayers.length - nearestPowerOfTwo;

        let playersInThisRound: TournamentUserDTOType[];
        let byes: TournamentUserDTOType[] = [];

        if (excessPlayers > 0) {
            const numToPlay = excessPlayers * 2;
            playersInThisRound = activePlayers.slice(0, numToPlay);
            byes = activePlayers.slice(numToPlay);
        } else {
            playersInThisRound = activePlayers;
        }

        const gamesForThisRound: GameDTOType[] = [];
        let gameIndex = 0;

        for (let i = 0; i < playersInThisRound.length; i += 2) {
            if (gameIndex >= lockedGames.length) {
                alert("Not enough games available for all matches.");
                break;
            }

            const player1 = playersInThisRound[i];
            const player2 = playersInThisRound[i + 1];
            const game = lockedGames[gameIndex];

            // Assign players to the game and unlock it
            game.players = [];
            if (player1)
                game.players.push({ ...player1, score: 0 } as GameUserDTOType);
            if (player2)
                game.players.push({ ...player2, score: 0 } as GameUserDTOType);

            game.status = GameStatus.IN_PROGRESS;
            game.updatedAt = new Date();

            gamesForThisRound.push(game);
            gameIndex++;
        }

        // Update the games array with the modified games
        const updatedGames = games.map((game) => {
            const updatedGame = gamesForThisRound.find((g) => g.id === game.id);
            return updatedGame || game;
        });

        setGames(updatedGames);
        setRound((prev) => prev + 1);

        return gamesForThisRound;
    };

    const playGame = () => {
        const activeGames = games.filter(
            (game) => game.status === GameStatus.IN_PROGRESS
        );
        if (activeGames.length === 0) {
            alert("No active games to play.");
            return;
        }

        // Play the first active game for simplicity
        const gameToPlay = activeGames[0];
        setCurrentGame(gameToPlay);
    };

    const setWinner = (gameId: number, winnerUsername: string) => {
        const gameIndex = games.findIndex((g) => g.id === gameId);
        if (gameIndex === -1) return;

        const game = games[gameIndex];
        if (game.status === GameStatus.FINISHED) return;

        const winner = game.players.find((p) => p.username === winnerUsername);
        if (!winner) return;

        game.winner = winner.username;
        game.status = GameStatus.FINISHED;

        setPlayers((prev) => {
            return prev.map((p) => {
                if (p.id === winner.id) return p;
                if (game.players.find((gp) => gp.id === p.id)) {
                    return { ...p, eliminated: true };
                }
                return p;
            });
        });

        const updatedGames = games.map((g, i) => (i === gameIndex ? game : g));
        const inProgressGames = updatedGames.filter(
            (g) => g.status === GameStatus.IN_PROGRESS
        );

        if (inProgressGames.length === 0) {
            // All games in current round are finished, check remaining active players
            const activePlayers = players.filter(
                (p) => !p.eliminated && p.id !== winner.id
            );
            activePlayers.push(players.find((p) => p.id === winner.id)!);

            if (activePlayers.length === 1) {
                // Tournament is over, set the winner
                setWinnerId(winner.id);
                setStatus(GameStatus.FINISHED);
            }
        }

        setGames(updatedGames);
    };

    const contextValue: LocalTournamentContextType = {
        status,
        players,
        games,
        round,
        winnerId,
        maxPlayers,
        setStatus,
        setPlayers,
        setGames,
        setRound,
        setWinner,
        startTournament,
        endTournament,
        addPlayer,
        removePlayer,
        createRound,
        getActivePlayers,
        currentGame,
        setCurrentGame,
        playGame,
        deleteTournament,
    };

    return (
        <div>
            <LocalTournamentContext.Provider value={contextValue}>
                {children}
            </LocalTournamentContext.Provider>
        </div>
    );
};

// Custom hook to use the tournament context - renamed to useLocalTournament
export const useLocalTournament = (): LocalTournamentContextType => {
    const context = useContext(LocalTournamentContext);

    if (context === undefined) {
        throw new Error(
            "useLocalTournament must be used within a LocalTournamentProvider"
        );
    }

    return context;
};

// Export the context for direct access if needed
export { LocalTournamentContext };
