import React, {
    createContext,
    useContext,
    useEffect,
    useNavigate,
    useState,
} from "react";
import { tournamentApi } from "../service/TournamentApi";
import { Toast } from "@shared/lib/Toast";
import { useUser } from "@features/auth/model/useUser";
import { GameStatus, TournamentUserDTOType } from "shared";
import { useWebSocket } from "@shared/hooks/useWebSocket";

interface RemoteTournamentContextType {
    players: TournamentUserDTOType[];
}

const RemoteTournamentContext = createContext<
    RemoteTournamentContextType | undefined
>(undefined);

export const useRemoteTournament = (): RemoteTournamentContextType => {
    const context = useContext(RemoteTournamentContext);

    if (context === undefined) {
        throw new Error(
            "useRemoteTournament must be used within a RemoteTournamentProvider"
        );
    }

    return context;
};

export const RemoteTournamentProvider = ({
    children,
    uuid,
}: {
    children?: ReactNode;
    uuid: string;
}) => {
    const navigate = useNavigate();
    const { user } = useUser();

    const [status, setStatus] = useState<GameStatus | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [host, setHost] = useState<number | null>(null);
    const [player, setPlayer] = useState<TournamentUserDTOType | null>(null);
    const [players, setPlayers] = useState<TournamentUserDTOType[]>([]);

    const fetchTournament = async () => {
        const tournament = await tournamentApi.get(uuid);
        if (!tournament) {
            Toast.error("Tournament not found");
            navigate("/game/remote/tournament");
            return;
        }

        setStatus(tournament.status);
        setHost(tournament.hostId);
        setPlayers(tournament.players);
        const currentPlayer = tournament.players.find((p) => p.id === user?.id);
        setPlayer(currentPlayer ?? null);

        console.log("Tournament data loaded:", tournament);
    };

    const { addHook, sendMessage } = useWebSocket(`/tournament/join/${uuid}`);

    const handleSocketMessage = (msg: MessageEvent) => {
        const payload = JSON.parse(msg.data);
        console.log("Received message:", payload);
    };

    const onConnectionClose = (event: CloseEvent) => {
        if (event.wasClean) {
            if (event.code === 4004) {
                Toast.error("Tournament not found");
                navigate("/game/remote/tournament");
            }
        }
    };

    useEffect(() => {
        addHook({ type: "onMessage", callback: handleSocketMessage });
        addHook({
            type: "onConnect",
            callback: () => fetchTournament(),
        });
        addHook({
            type: "onDisconnect",
            callback: onConnectionClose,
        });
    }, []);

    const contextValue: RemoteTournamentContextType = { players };

    return (
        <div className="w-full h-full">
            <RemoteTournamentContext.Provider value={contextValue}>
                {children}
            </RemoteTournamentContext.Provider>
        </div>
    );
};
