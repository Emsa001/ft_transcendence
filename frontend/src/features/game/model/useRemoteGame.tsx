import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { useUser } from "@features/auth/model/useUser";
import { useWebSocket } from "@shared/hooks/useWebSocket";
import {
    GameDTOType,
    GameFrame,
    GameMessage,
    GameMode,
    GameStatus,
    GameUserDTOType,
} from "shared";
import { useGameKeys } from "./useGameKeys";
import { useGameMessages } from "./useGameMessages";
import { Toast } from "@shared/lib/Toast";

interface RemoteGameContextType {
    host: number | null;
    status: GameStatus;
    mode: GameMode;
    isPrivate: boolean;
    round: number;
    isTournament: boolean;
    maxScore: number;
    player: GameUserDTOType | null;
    players: GameUserDTOType[];
    maxPlayers: number;
    winner: string | null;
    createdAt: Date;
    updatedAt: Date;
    code: string;
    handleStartGame: () => void;

    frameRef: RefObject<GameFrame | null>;
    messages: RefObject<GameMessage[] | null>;
    error: string | null;
}

const RemoteGameContext = createContext<RemoteGameContextType | undefined>(
    undefined
);

// Hook to use game context
export const useRemoteGame = (): RemoteGameContextType => {
    const context = useContext(RemoteGameContext);
    if (!context) {
        throw new Error("useRemoteGame must be used inside RemoteGameProvider");
    }
    return context;
};

interface RemoteGameProviderProps {
    code: string;
    children?: ReactNode;
    onEnd?: () => void;
}

export const RemoteGameProvider = ({
    code,
    children,
    onEnd,
}: RemoteGameProviderProps) => {
    const { user } = useUser();

    const [status, setStatus] = useState<GameStatus | null>(null);
    const statusRef = useRef<GameStatus | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [host, setHost] = useState<number | null>(null);
    const [player, setPlayer] = useState<GameUserDTOType | null>(null);
    const [mode, setMode] = useState<GameMode | null>(null);
    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const [round, setRound] = useState<number>(0);
    const [maxScore, setMaxScore] = useState<number>(0);
    const [players, setPlayers] = useState<GameUserDTOType[]>([]);
    const [winner, setWinner] = useState<string | null>(null);
    const [maxPlayers, setMaxPlayers] = useState<number>(0);
    const [isTournament, setIsTournament] = useState<boolean>(false);

    const frameRef = useRef<GameFrame | null>(null);

    const { messages } = useGameMessages();
    const { addHook, sendMessage } = useWebSocket(`/game/join/${code}`);

    useGameKeys({
        onKeyDown: (key) => {
            sendMessage({ type: "PLAYER_INPUT", key, state: "down" });
            console.log("Key down:", key);
        },
        onKeyUp: (key) => {
            sendMessage({ type: "PLAYER_INPUT", key, state: "up" });
        },
    });

    const handleSocketMessage = (msg: MessageEvent) => {
        const payload = JSON.parse(msg.data);

        switch (payload.type) {
            case "GAME_UPDATE": {
                const state: GameDTOType = payload.state;
                statusRef.current = state.status;

                setStatus(state.status);
                setMode(state.mode);
                setIsPrivate(state.isPrivate);
                setPlayers(state.players);
                setWinner(state.winner);
                setMaxPlayers(state.maxPlayers);
                setPlayer(state.players.find((p) => p.id === user!.id) || null);
                setHost(state.hostId);
                setIsTournament(state.tournamentId ? true : false);

                if (state.round) setRound(state.round);
                if (state.maxScore) setMaxScore(state.maxScore);
                if (state.status === GameStatus.FINISHED && onEnd) onEnd();
                break;
            }

            case "GAME_FRAME": {
                frameRef.current = {
                    ball: payload.frame.ball ?? frameRef.current?.ball,
                    paddles: {
                        ...frameRef.current?.paddles,
                        ...payload.frame.paddles,
                    },
                };
                break;
            }

            case "GAME_MESSAGE": {
                messages.current = payload.message;
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

                Toast.success(`${payload.player.username} has joined the game`);
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

                Toast.error(`${payload.player.username} has left the game`);
                break;
            }

            case "error":
                console.error("Game error:", payload.message);
                break;
            default:
                console.warn("Unknown message type:", payload.type);
        }
    };

    const onConnectionClose = (event: CloseEvent) => {
        if (event.wasClean) {
            if (event.code === 4004) {
                setError("Connection closed: " + event.reason);
            }
        }
    };

    const handleStartGame = () => {
        sendMessage({ type: "START_GAME" });
    };

    // Hooks for lifecycle
    useEffect(() => {
        addHook({ type: "onMessage", callback: handleSocketMessage });
        addHook({
            type: "onConnect",
            callback: () => console.log("WebSocket connected"),
        });
        addHook({
            type: "onDisconnect",
            callback: onConnectionClose,
        });
    }, []);

    const values: RemoteGameContextType = {
        host,
        status: status!,
        mode: mode!,
        isPrivate,
        round,
        maxScore,
        player,
        players: players.sort((a, b) => a.id - b.id),
        maxPlayers,
        winner,
        createdAt: new Date(),
        updatedAt: new Date(),
        handleStartGame,
        code,
        frameRef,
        messages,
        error,
        isTournament,
    };

    return (
        <div className="w-full h-full">
            <RemoteGameContext.Provider value={values}>
                {children}
            </RemoteGameContext.Provider>
        </div>
    );
};
