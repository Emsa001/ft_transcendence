import { useWebSocket } from "@shared/hooks/useWebSocket";
import { useEffect, useState } from "react";

type ModalState = "creating" | "joining" | null;

export const useGameLobby = (code?: string) => {
    const [modal, setModal] = useState<ModalState>(null);
    const [games, setGames] = useState<number>(0);

    const { addHook, sendMessage, isConnected } = useWebSocket("/game/lobby");

    const handleSocketMessage = (msg: MessageEvent) => {
        const payload = JSON.parse(msg.data);

        if (payload.type === "lobby_update") {
            console.log(payload, msg.data);
            setGames(payload.games);
        }
    };

    useEffect(() => {
        addHook({ type: "onMessage", callback: handleSocketMessage });
    }, []);

    return {
        sendMessage,
        isConnected,
        games,
        modal,
        setModal,
    };
};
