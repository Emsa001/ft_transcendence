import { useEffect, useLocalStorage } from "react";
import { TournamentDTOType } from "shared";
import { LocalTournamentState } from "../types";

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
            });
        }
    }, []);

    return {
        setLocalTournamentData,
    };
};
