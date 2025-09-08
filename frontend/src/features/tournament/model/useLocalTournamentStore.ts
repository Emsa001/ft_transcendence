import { useEffect, useLocalStorage } from "react";
import { GameStatus, TournamentDTOType } from "shared";
import { LocalTournamentState } from "../types";

export const DefaultTournamentState: LocalTournamentState = {
    tournamentId: Date.now(),
    status: GameStatus.WAITING,
    players: [],
    games: [],
    round: 1,
    winner: null,
    currentGame: null,
    randomEvents: false,
    maxScore: 1,
};

export const useLocalTournamentStore = (
    state: LocalTournamentState,
    updateState: (updates: Partial<LocalTournamentState>) => void
) => {
    const [localTournamentData, setLocalTournamentData] =
        useLocalStorage<TournamentDTOType | null>("localTournament", null);

    useEffect(() => {
        if (
            localTournamentData &&
            localTournamentData.id !== state.tournamentId
        )
            return;

        const data = {
            id: state.tournamentId,
            name: "Local Tournament",
            status: state.status,
            players: state.players,
            games: state.games,
            round: state.round,
            winner: state.winner,
            maxScore: state.maxScore,
            randomEvents: state.randomEvents,
        };

        setLocalTournamentData(data as TournamentDTOType);
    }, [state.status, state.games, state.round, state.winner]);

    // Load from localStorage on mount
    useEffect(() => {
        if (localTournamentData) {
            updateState({
                tournamentId: localTournamentData.id,
                status: localTournamentData.status,
                players: localTournamentData.players,
                games: localTournamentData.games ?? [],
                round: localTournamentData.round,
                winner: localTournamentData.winner,
                maxScore: localTournamentData.maxScore ?? 1,
                randomEvents: localTournamentData.randomEvents ?? false,
            });
        }
    }, []);

    return {
        setLocalTournamentData,
    };
};
