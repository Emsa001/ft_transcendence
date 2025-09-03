import { useState } from "react";
import { GameDTOType, GameStatus, TournamentUserDTOType } from "shared";
import { TournamentLogic } from "./tournamentLogic";
import { LocalTournamentState } from "../types";

export const useLocalTournamentState = (maxPlayers: number) => {
    const [state, setState] = useState<LocalTournamentState>({
        tournamentId: Date.now(),
        status: GameStatus.WAITING,
        players: [],
        games: [],
        round: 1,
        winnerId: null,
        currentGame: null,
    });

    const updateState = (updates: Partial<LocalTournamentState>) => {
        setState((prev) => ({ ...prev, ...updates }));
    };

    const addPlayer = (username: string): StatusMessage => {
        const error = TournamentLogic.validatePlayerAddition(
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
        const error = TournamentLogic.validateTournamentStart(state.players);
        if (error) {
            alert(error);
            return;
        }

        const totalGames = TournamentLogic.createAllGames(state.players.length);
        setState((prev) => ({
            ...prev,
            games: totalGames,
            status: GameStatus.IN_PROGRESS,
        }));
    };

    const endTournament = () => {
        const activePlayers = TournamentLogic.getActivePlayers(state.players);
        if (activePlayers.length !== 1) {
            alert(
                "Tournament cannot be ended. There should be exactly one winner."
            );
            return;
        }
        setState((prev) => ({
            ...prev,
            winnerId: activePlayers[0].id,
            status: GameStatus.FINISHED,
        }));
    };

    const createRound = (): GameDTOType[] => {
        if (state.status !== GameStatus.IN_PROGRESS) {
            alert("Tournament is not in progress.");
            return [];
        }

        if (!TournamentLogic.canAdvanceToNextRound(state.games)) {
            alert(
                "Cannot create a new round while there are games in progress."
            );
            return [];
        }

        const activePlayers = TournamentLogic.getActivePlayers(state.players);
        if (TournamentLogic.shouldTournamentEnd(activePlayers)) {
            alert("Cannot create a new round. Tournament should be finished.");
            return [];
        }

        const { updatedGames, gamesForRound } =
            TournamentLogic.assignPlayersToGames(
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

        const updatedGames = state.games.map((g, i) =>
            i === gameIndex ? game : g
        );

        // Check if round is complete
        const currentRoundGames = updatedGames.filter(
            (g) => g.round === state.round
        );
        const currentRoundInProgress = currentRoundGames.filter(
            (g) => g.status === GameStatus.IN_PROGRESS
        );

        const updates: Partial<LocalTournamentState> = {
            players: updatedPlayers,
            games: updatedGames,
        };

        if (currentRoundInProgress.length === 0) {
            const activePlayers =
                TournamentLogic.getActivePlayers(updatedPlayers);
            if (activePlayers.length === 1) {
                updates.winnerId = activePlayers[0].id;
                updates.status = GameStatus.FINISHED;
            } else {
                updates.round = state.round + 1;
            }
        }

        setState((prev) => ({ ...prev, ...updates }));
    };

    const playGame = () => {
        const activeGames = state.games.filter(
            (game) => game.status === GameStatus.IN_PROGRESS
        );
        if (activeGames.length === 0) {
            alert("No active games to play.");
            return;
        }
        setState((prev) => ({ ...prev, currentGame: activeGames[0] }));
    };

    const deleteTournament = () => {
        setState({
            tournamentId: Date.now(),
            status: GameStatus.WAITING,
            players: [],
            games: [],
            round: 1,
            winnerId: null,
            currentGame: null,
        });
    };

    return {
        state,
        actions: {
            updateState,
            addPlayer,
            removePlayer,
            startTournament,
            endTournament,
            createRound,
            setWinner,
            playGame,
            deleteTournament,
        },
    };
};
