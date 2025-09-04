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
    GameMode,
    GameStatus,
    GameUserDTOType,
} from "shared";
import { useGameKeys } from "./useGameKeys";

interface RemoteGameContextType {
    host: number;
    status: GameStatus;
    mode: GameMode;
    isPrivate: boolean;
    round: number;
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
    sendInput: (input: string) => void;
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
}

export const RemoteGameProvider = ({
    code,
    children,
}: RemoteGameProviderProps) => {
    const { user } = useUser();

    const [host, setHost] = useState<number>(-1);
    const [player, setPlayer] = useState<GameUserDTOType | null>(null);
    const [status, setStatus] = useState<GameStatus | null>(null);
    const [mode, setMode] = useState<GameMode | null>(null);
    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const [round, setRound] = useState<number>(0);
    const [maxScore, setMaxScore] = useState<number>(0);
    const [players, setPlayers] = useState<GameUserDTOType[]>([]);
    const [winner, setWinner] = useState<string | null>(null);
    const [maxPlayers, setMaxPlayers] = useState<number>(0);
    const frameRef = useRef<GameFrame | null>(null);

    const { addHook, sendMessage } = useWebSocket(`/game/play/${code}`);

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
                setStatus(state.status);
                setMode(state.mode);
                setIsPrivate(state.isPrivate);
                setPlayers(state.players);
                setWinner(state.winner);
                setMaxPlayers(state.maxPlayers);
                setPlayer(state.players.find((p) => p.id === user!.id) || null);
                setHost(state.hostId);

                if (state.round) setRound(state.round);
                if (state.maxScore) setMaxScore(state.maxScore);
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

            case "PLAYER_JOINED": {
                setPlayers((prev) => {
                    const exists = prev.some((p) => p.id === payload.player.id);
                    return exists ? prev : [...prev, payload.player];
                });
                break;
            }
            case "PLAYER_DISCONNECTED": {
                setPlayers((prev) =>
                    prev.filter((p) => p.id !== payload.player.id)
                );
                if (payload.host && payload.host !== host) {
                    setHost(payload.host);
                }
                break;
            }
            case "error":
                console.error("Game error:", payload.message);
                break;
            default:
                console.warn("Unknown message type:", payload.type);
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
            callback: () => console.log("WebSocket disconnected"),
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
        players,
        maxPlayers,
        winner,
        createdAt: new Date(),
        updatedAt: new Date(),
        handleStartGame,
        code,
        frameRef,
        sendInput: (input: string) =>
            sendMessage({ type: "PLAYER_INPUT", input }),
    };

    return (
        <div className="w-full h-full">
            <RemoteGameContext.Provider value={values}>
                {children}
            </RemoteGameContext.Provider>
        </div>
    );
};
