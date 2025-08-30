import React, {
    createContext,
    useContext,
    useEffect,
    useLocalStorage,
} from "react";
import { TournamentDTOType } from "shared";
import { LocalTournamentContextType } from "../types";
import { TournamentLogic } from "./tournamentLogic";
import { useLocalTournamentState } from "./useLocalTournamentState";

const LocalTournamentContext = createContext<
    LocalTournamentContextType | undefined
>(undefined);

interface LocalTournamentProviderProps {
    children?: any;
    maxPlayers?: number;
}

export const LocalTournamentProvider = ({
    children,
    maxPlayers = 16,
}: LocalTournamentProviderProps) => {
    const [tournamentData, setTournamentData] =
        useLocalStorage<TournamentDTOType | null>("localTournament", null);

    const { state, actions } = useLocalTournamentState(maxPlayers);

    // Sync with localStorage
    useEffect(() => {
        if (tournamentData && tournamentData.id !== state.tournamentId) {
            return;
        }

        const data = {
            id: state.tournamentId,
            name: "Local Tournament",
            status: state.status,
            players: state.players,
            games: state.games,
            round: state.round,
            maxPlayers,
            winnerId: state.winnerId,
        };

        setTournamentData(data as TournamentDTOType);
    }, [state.status, state.games, state.round, state.winnerId]);

    // Load from localStorage on mount
    useEffect(() => {
        if (tournamentData) {
            actions.updateState({
                tournamentId: tournamentData.id,
                status: tournamentData.status,
                players: tournamentData.players,
                games: tournamentData.games ?? [],
                round: tournamentData.round,
                winnerId: tournamentData.winnerId,
            });
        }
    }, []);

    const handleDeleteTournament = () => {
        actions.deleteTournament();
        setTournamentData(null);
    };

    const contextValue: LocalTournamentContextType = {
        ...state,
        maxPlayers,
        getActivePlayers: () => TournamentLogic.getActivePlayers(state.players),
        setStatus: (status) => actions.updateState({ status }),
        setPlayers: (players) => {
            const newPlayers =
                typeof players === "function"
                    ? players(state.players)
                    : players;
            actions.updateState({ players: newPlayers });
        },
        setGames: (games) => actions.updateState({ games }),
        setRound: (round) => {
            const newRound =
                typeof round === "function" ? round(state.round) : round;
            actions.updateState({ round: newRound });
        },
        setCurrentGame: (currentGame) => actions.updateState({ currentGame }),
        ...actions,
        deleteTournament: handleDeleteTournament,
        nextRound: actions.createRound, // Alias for backward compatibility
    };

    return (
        <div className="w-full h-full">
            <LocalTournamentContext.Provider value={contextValue}>
                {children}
            </LocalTournamentContext.Provider>
        </div>
    );
};

export const useLocalTournament = (): LocalTournamentContextType => {
    const context = useContext(LocalTournamentContext);

    if (context === undefined) {
        throw new Error(
            "useLocalTournament must be used within a LocalTournamentProvider"
        );
    }

    return context;
};

export { LocalTournamentContext };
