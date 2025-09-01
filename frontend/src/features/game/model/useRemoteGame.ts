import { useWebSocket } from "@shared/hooks/useWebSocket";
import { useEffect, useState } from "react";
import { GameCreationAttributes } from "shared";
import GameApi from "../service/GameAPI";

export const useRemoteGame = (code: string) => {
    const [players, setPlayers] = useState<string[]>([]);
    const [gameStarted, setGameStarted] = useState(false);

    const { addHook, sendMessage, isConnected } = useWebSocket(
        `/game/play/${code}`
    );

    const handleSocketMessage = (msg: MessageEvent) => {
        const payload = JSON.parse(msg.data);

        console.log("Received WebSocket message:", payload);
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
        players,
        gameStarted,
    };
};
