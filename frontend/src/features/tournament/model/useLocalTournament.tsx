import React, { createContext, useContext, useEffect } from "react";

import { useState } from "react";
import { GameDTOType, GameStatus, TournamentUserDTOType } from "shared";
import { LocalTournamentContextType, LocalTournamentState } from "../types";
import { TournamentEngine } from "../service/TournamentEngine";
import {
    DefaultTournamentState,
    useLocalTournamentStore,
} from "./useLocalTournamentStore";
import Swal from "sweetalert2";

const LocalTournamentContext = createContext<
    LocalTournamentContextType | undefined
>(undefined);

export const useLocalTournament = (): LocalTournamentContextType => {
    const context = useContext(LocalTournamentContext);

    if (context === undefined) {
        throw new Error(
            "useLocalTournament must be used within a LocalTournamentProvider"
        );
    }

    return context;
};

interface LocalTournamentProviderProps {
    children?: any;
    maxPlayers?: number;
}

export const LocalTournamentProvider = ({
    children,
    maxPlayers = 16,
}: LocalTournamentProviderProps) => {
    const [state, setState] = useState<LocalTournamentState>(
        DefaultTournamentState
    );

    const updateState = (updates: Partial<LocalTournamentState>) => {
        setState((prev) => ({ ...prev, ...updates }));
    };

    const { setLocalTournamentData } = useLocalTournamentStore(
        state,
        updateState
    );

    const addPlayer = (username: string): StatusMessage => {
        const error = TournamentEngine.validatePlayerAddition(
            state.players,
            username,
            maxPlayers,
            state.status
        );

        if (error) {
            return { message: error, success: false };
        }

        const newPlayer: TournamentUserDTOType = {
            id: Date.now() + Math.floor(Math.random() * 10000),
            username,
            avatar: null,
            eliminated: false,
        };

        setState((prev) => ({
            ...prev,
            players: [...prev.players, newPlayer],
        }));

        return { message: `${username} added successfully.`, success: true };
    };

    const removePlayer = (username: string) => {
        if (state.status !== GameStatus.WAITING) {
            alert("Cannot remove players after the tournament has started.");
            return;
        }
        setState((prev) => ({
            ...prev,
            players: prev.players.filter((p) => p.username !== username),
        }));
    };

    const startTournament = () => {
        const error = TournamentEngine.validateTournamentStart(state.players);
        if (error) {
            alert(error);
            return;
        }

        const totalGames = TournamentEngine.createAllGames(
            state.players.length
        );

        // Update state with games and mark tournament as in progress
        setState((prev) => {
            const newState = {
                ...prev,
                games: totalGames,
                status: GameStatus.IN_PROGRESS,
            };

            // Immediately start the first round
            const activePlayers = TournamentEngine.getActivePlayers(
                newState.players
            );
            const { updatedGames, gamesForRound } = TournamentEngine.startRound(
                newState.games,
                newState.round,
                activePlayers
            );

            return {
                ...newState,
                games: updatedGames,
            };
        });
    };

    const endTournament = () => {
        const activePlayers = TournamentEngine.getActivePlayers(state.players);
        if (activePlayers.length !== 1) {
            alert(
                "Tournament cannot be ended. There should be exactly one winner."
            );
            return;
        }
        setState((prev) => ({
            ...prev,
            winner: activePlayers[0].username,
            status: GameStatus.FINISHED,
        }));
    };

    const startRound = (): GameDTOType[] => {
        if (state.status !== GameStatus.IN_PROGRESS) {
            alert("Tournament is not in progress.");
            return [];
        }

        if (!TournamentEngine.canAdvanceToNextRound(state.games)) {
            alert(
                "Cannot create a new round while there are games in progress."
            );
            return [];
        }

        const activePlayers = TournamentEngine.getActivePlayers(state.players);
        if (TournamentEngine.shouldTournamentEnd(activePlayers)) {
            alert("Cannot create a new round. Tournament should be finished.");
            return [];
        }

        const { updatedGames, gamesForRound } = TournamentEngine.startRound(
            state.games,
            state.round,
            activePlayers
        );

        setState((prev) => ({ ...prev, games: updatedGames }));
        return gamesForRound;
    };

    const setWinner = (gameId: number, winnerUsername: string) => {
        const gameIndex = state.games.findIndex((g) => g.id === gameId);
        if (gameIndex === -1) return;

        const game = state.games[gameIndex];
        if (game.status === GameStatus.FINISHED) return;

        const winner = game.players.find((p) => p.username === winnerUsername);
        if (!winner) return;

        game.winner = winner.username;
        game.status = GameStatus.FINISHED;

        const updatedPlayers = state.players.map((p) => {
            if (p.id === winner.id) return p;
            if (game.players.find((gp) => gp.id === p.id)) {
                return { ...p, eliminated: true };
            }
            return p;
        });

        const games = state.games.map((g, i) => (i === gameIndex ? game : g));

        // Check if round is complete
        const currentRoundGames = games.filter((g) => g.round === state.round);
        const currentRoundInProgress = currentRoundGames.filter(
            (g) => g.status === GameStatus.IN_PROGRESS
        );

        const updates: Partial<LocalTournamentState> = {
            players: updatedPlayers,
            games: games,
        };

        if (currentRoundInProgress.length === 0) {
            const activePlayers =
                TournamentEngine.getActivePlayers(updatedPlayers);
            if (activePlayers.length === 1) {
                updates.winner = activePlayers[0].username;
                updates.status = GameStatus.FINISHED;
            } else {
                updates.round = state.round + 1;
                const { updatedGames, gamesForRound } =
                    TournamentEngine.startRound(
                        games,
                        updates.round,
                        activePlayers
                    );
                updates.games = updatedGames;
            }
        }

        setState((prev) => {
            return { ...prev, ...updates };
        });
    };

    const playGame = (code: string) => {
        const gameToPlay = state.games.find((game) => game.code === code);
        if (!gameToPlay || gameToPlay.status !== GameStatus.IN_PROGRESS) {
            alert("Game not found or not active.");
            return;
        }
        setState((prev) => ({ ...prev, currentGame: gameToPlay }));
    };

    const deleteTournament = async () => {
        // @ts-ignore
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This will delete the current tournament and all progress.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            theme: "dark",
        });

        if (result.isConfirmed) {
            setState(DefaultTournamentState);
            setLocalTournamentData(null);
        }
    };

    const contextValue: LocalTournamentContextType = {
        ...state,
        maxPlayers,

        setMaxScore: (score: number) => updateState({ maxScore: score }),
        setRandomEvents: (value: boolean) =>
            updateState({ randomEvents: value }),

        addPlayer,
        removePlayer,
        startTournament,
        endTournament,
        startRound,
        setWinner,
        playGame,
        deleteTournament,
        getActivePlayers: () =>
            TournamentEngine.getActivePlayers(state.players),
        setCurrentGame: (game: GameDTOType | null) =>
            updateState({ currentGame: game }),
    };

    return (
        <div className="w-full h-full">
            <LocalTournamentContext.Provider value={contextValue}>
                {children}
            </LocalTournamentContext.Provider>
        </div>
    );
};

export { LocalTournamentContext };
