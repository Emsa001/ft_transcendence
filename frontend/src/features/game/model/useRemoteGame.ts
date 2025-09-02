import { useUser } from "@features/auth/model/useUser";
import { useWebSocket } from "@shared/hooks/useWebSocket";
import { useEffect, useNavigate, useState } from "react";
import { GameDTOType, GameMode, GameStatus, GameUserDTOType } from "shared";

// User should always exist when using this hook
export const useRemoteGame = (code: string) => {
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

    const { addHook, sendMessage, isConnected } = useWebSocket(
        `/game/play/${code}`
    );

    const handleSocketMessage = (msg: MessageEvent) => {
        const payload = JSON.parse(msg.data);

        switch (payload.type) {
            case "GAME_UPDATE":
                {
                    const state: GameDTOType = payload.state;
                    setStatus(state.status);
                    setMode(state.mode);
                    setIsPrivate(state.isPrivate);
                    setPlayers(state.players);
                    setWinner(state.winner);
                    setMaxPlayers(state.maxPlayers);
                    setPlayer(
                        state.players.find((p) => p.id === user!.id) || null
                    );
                    setHost(state.hostId);

                    if (state.round) setRound(state.round);
                    if (state.maxScore) setMaxScore(state.maxScore);
                }
                break;
            case "PLAYER_JOINED":
                {
                    console.log(`Player joined: ${payload.player.username}`);
                    setPlayers((prev) => {
                        const exists = prev.some(
                            (p) => p.id === payload.player.id
                        );
                        return exists ? prev : [...prev, payload.player];
                    });
                }
                break;
            case "PLAYER_DISCONNECTED":
                {
                    setPlayers((prev) =>
                        prev.filter((p) => p.id !== payload.player.id)
                    );
                    if (payload.host != host) {
                        setHost(payload.host);
                    }
                }
                break;
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

    const handleConnection = () => {
        console.log("WebSocket connected");
    };

    const handleDisconnection = () => {
        console.log("WebSocket disconnected");
    };

    // Add hooks
    useEffect(() => {
        addHook({ type: "onMessage", callback: handleSocketMessage });
        addHook({ type: "onConnect", callback: handleConnection });
        addHook({ type: "onDisconnect", callback: handleDisconnection });
    }, []);

    return {
        host,
        status: status!,
        mode: mode!,
        isPrivate,
        round: round!,
        maxScore: maxScore!,
        player,
        players,
        maxPlayers,
        winner,
        createdAt: new Date(),
        updatedAt: new Date(),
        handleStartGame,
    };
};
