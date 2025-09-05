import React, {
    createContext,
    useContext,
    useEffect,
    useNavigate,
    useRef,
    useState,
} from "react";
import { tournamentApi } from "../service/TournamentApi";
import { Toast } from "@shared/lib/Toast";
import { useUser } from "@features/auth/model/useUser";
import {
    GameDTOType,
    GameStatus,
    TournamentDTOType,
    TournamentUserDTOType,
} from "shared";
import { useWebSocket } from "@shared/hooks/useWebSocket";

interface RemoteTournamentContextType {
    players: TournamentUserDTOType[];

    games: GameDTOType[];
    currentGame: GameDTOType | null;
    setCurrentGame: SetState<GameDTOType | null>;

    status: GameStatus | null;
    host: number | null;
    player: TournamentUserDTOType | null;
    error: string | null;

    start: () => Promise<void>;
    joinGame: (code: string) => void;
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
    const { user } = useUser(true);

    const statusRef = useRef<GameStatus | null>(null);
    const [status, setStatus] = useState<GameStatus | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [host, setHost] = useState<number | null>(null);
    const [player, setPlayer] = useState<TournamentUserDTOType | null>(null);
    const [players, setPlayers] = useState<TournamentUserDTOType[]>([]);
    const [games, setGames] = useState<GameDTOType[]>([]);

    const [currentGame, setCurrentGame] = useState<GameDTOType | null>(null);

    const { addHook, sendMessage } = useWebSocket(`/tournament/${uuid}/join`);

    const handleSocketMessage = (msg: MessageEvent) => {
        const payload = JSON.parse(msg.data);
        console.log("Received message:", payload);

        switch (payload.type) {
            case "STATE_UPDATE": {
                const state: TournamentDTOType = payload.state;
                statusRef.current = state.status;
                setStatus(state.status);
                setHost(state.hostId);
                setPlayers(state.players);
                const currentPlayer = state.players.find(
                    (p) => p.id === user?.id
                );
                setPlayer(currentPlayer ?? null);
                if (state.games) {
                    setGames(state.games);
                }
                break;
            }

            case "GAME_UPDATE": {
                const game: GameDTOType = payload.game;
                setGames((prev) => {
                    const exists = prev.some((g) => g.id === game.id);
                    if (exists) {
                        return prev.map((g) => (g.id === game.id ? game : g));
                    }
                    return [...prev, game];
                });
                break;
            }

            case "PLAYER_JOINED": {
                if (statusRef.current === GameStatus.WAITING) {
                    setPlayers((prev) => {
                        const exists = prev.some(
                            (p) => p.id === payload.player.id
                        );
                        return exists ? prev : [...prev, payload.player];
                    });
                }

                Toast.success(
                    `${payload.player.username} has joined the tournament`
                );
                break;
            }

            case "PLAYER_DISCONNECTED": {
                if (statusRef.current === GameStatus.WAITING) {
                    setPlayers((prev) =>
                        prev.filter((p) => p.id !== payload.player.id)
                    );
                    if (payload.host && payload.host !== host) {
                        setHost(payload.host);
                    }
                }

                Toast.error(
                    `${payload.player.username} has left the tournament`
                );
                break;
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

    const onConnectionClose = (event: CloseEvent) => {
        if (event.wasClean) {
            if (event.code === 4004) {
                Toast.error("Tournament not found");
                navigate("/game/remote/tournament");
            }
        }
    };

    const start = async () => {
        const tournament = await tournamentApi.start(uuid);
        console.log(tournament);
        if (tournament.error) {
            setError("Failed to start tournament");
            return;
        }

        console.log("Tournament started:", tournament);
    };

    const joinGame = (code: string) => {
        const game = games.find((g) => g.code === code);
        if (!game) {
            Toast.error("Game not found");
            return;
        }

        if (!game.players.some((p) => p.id === user?.id)) {
            Toast.error("You are not part of this game");
            return;
        }

        setCurrentGame(game);
    };

    const contextValue: RemoteTournamentContextType = {
        players,
        status,
        host,
        player,
        error,
        games,

        currentGame,
        setCurrentGame,

        start,
        joinGame,
    };

    return (
        <div className="w-full h-full">
            <RemoteTournamentContext.Provider value={contextValue}>
                {children}
            </RemoteTournamentContext.Provider>
        </div>
    );
};
