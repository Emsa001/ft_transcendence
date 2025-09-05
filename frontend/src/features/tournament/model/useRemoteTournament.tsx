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
import { GameStatus, TournamentDTOType, TournamentUserDTOType } from "shared";
import { useWebSocket } from "@shared/hooks/useWebSocket";

interface RemoteTournamentContextType {
    players: TournamentUserDTOType[];
    start: () => Promise<void>;

    status: GameStatus | null;
    host: number | null;
    player: TournamentUserDTOType | null;
    error: string | null;
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

    const start = async () => {
        const tournament = await tournamentApi.start(uuid);
        console.log(tournament);
        if (tournament.error) {
            setError("Failed to start tournament");
            return;
        }

        console.log("Tournament started:", tournament);
    };

    const { addHook, sendMessage } = useWebSocket(`/tournament/${uuid}/join`);

    const handleSocketMessage = (msg: MessageEvent) => {
        const payload = JSON.parse(msg.data);
        console.log("Received message:", payload);

        switch (payload.type) {
            case "STATE_UPDATE": {
                const state: TournamentDTOType = payload.state;
                setStatus(state.status);
                setHost(state.hostId);
                setPlayers(state.players);
                const currentPlayer = state.players.find(
                    (p) => p.id === user?.id
                );
                setPlayer(currentPlayer ?? null);
                break;
            }
        }
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
            type: "onDisconnect",
            callback: onConnectionClose,
        });
    }, []);

    const contextValue: RemoteTournamentContextType = {
        players,
        start,
        status,
        host,
        player,
        error,
    };

    return (
        <div className="w-full h-full">
            <RemoteTournamentContext.Provider value={contextValue}>
                {children}
            </RemoteTournamentContext.Provider>
        </div>
    );
};
