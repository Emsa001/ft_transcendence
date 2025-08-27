import { useEffect, useLocalStorage, useState } from "react";
import {
    GameDTOType,
    GameMode,
    GameStatus,
    TournamentUserDTOType,
    GameUserDTOType,
    TournamentDTOType,
} from "shared";

export const useLocalTournament = (maxPlayers = 16) => {
    const [tournamentData, setTournamentData] =
        useLocalStorage<TournamentDTOType | null>("localTournament", null);

    const [tournamentId, setTournamentId] = useState<number>(Date.now());
    const [status, setStatus] = useState<GameStatus>(GameStatus.WAITING);
    const [players, setPlayers] = useState<TournamentUserDTOType[]>([]);
    const [games, setGames] = useState<GameDTOType[]>([]);
    const [round, setRound] = useState(1);
    const [winnerId, setWinnerId] = useState<number | null>(null);

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

    // --- Tournament actions ---
    const startTournament = () => {
        console.log(players, round);

        if (players.length < 2) {
            alert("At least 2 players are required to start the tournament.");
            return;
        }
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

    const addPlayer = (username: string): boolean => {
        if (players.length >= maxPlayers) {
            alert("Maximum number of players reached.");
            return false;
        }

        const newPlayer = {
            username,
            eliminated: false,
        } as unknown as TournamentUserDTOType;

        setPlayers((prev) => [...prev, newPlayer]);
        return true;
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

        // Check if there are any games currently in progress
        const gamesInProgress = games.filter(
            (game) => game.status != GameStatus.FINISHED
        );

        if (gamesInProgress.length > 0) {
            alert(
                "Cannot create a new round while there are games in progress."
            );
            return [];
        }

        const activePlayers = getActivePlayers();
        const roundGames: GameDTOType[] = [];

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

        for (let i = 0; i < playersInThisRound.length; i += 2) {
            const player1 = playersInThisRound[i];
            const player2 = playersInThisRound[i + 1];

            const game: GameDTOType = {
                id: Date.now() + i,
                status: GameStatus.WAITING,
                mode: GameMode.NORMAL,
                players: [] as GameUserDTOType[],
                winner: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            if (player1)
                game.players.push({ ...player1, score: 0 } as GameUserDTOType);
            if (player2)
                game.players.push({ ...player2, score: 0 } as GameUserDTOType);

            game.status = GameStatus.IN_PROGRESS;

            roundGames.push(game);
        }

        setGames(roundGames);
        setRound((prev) => prev + 1);

        return roundGames;
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

    return {
        status,
        players,
        games,
        round,
        winnerId,
        setStatus,
        setPlayers,
        setGames,
        setRound,
        setWinnerId,
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
};
