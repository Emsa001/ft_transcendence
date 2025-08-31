import { useWebSocket } from "@shared/hooks/websocket";
import React, { useState, useEffect } from "react";
import GameApi from "../service/api";
import { GameInvite } from "./components/GameInvite";

interface GameRemoteProps {
    code?: string; // Optional code for joining existing game
}

export const GameRemote = ({ code }: GameRemoteProps) => {
    const [gameCode, setGameCode] = useState<string | null>(code || null);
    const [players, setPlayers] = useState<string[]>([]);
    const [gameStarted, setGameStarted] = useState(false);

    const { messages, sendMessage, isConnected } = useWebSocket(
        gameCode ? `/game/play/${gameCode}` : null
    );

    useEffect(() => {
        if (gameCode) return;

        const createGame = async () => {
            try {
                const res = await GameApi.createGame();
                setGameCode(res.data.code);
                console.log("Created game with code", res.data.code);
            } catch (err) {
                console.error("Failed to create game", err);
            }
        };

        createGame();
    }, []);

    useEffect(() => {
        if (isConnected && gameCode) {
            console.log("WebSocket connected, joining game", gameCode);
            sendMessage({
                type: "JOIN_GAME",
                code: gameCode,
            });
        }
    }, [isConnected, gameCode, sendMessage]);

    useEffect(() => {
        const last = messages[messages.length - 1];
        if (!last) return;

        switch (last.type) {
            case "PLAYER_JOINED":
                setPlayers((prev) => {
                    if (!prev.includes(last.player))
                        return [...prev, last.player];
                    return prev;
                });
                break;
            case "PLAYER_DISCONNECTED":
                setPlayers((prev) => {
                    if (prev.includes(last.player))
                        return prev.filter((p) => p !== last.player);
                    return prev;
                });
                break;

            case "GAME_STARTED":
                console.log("Game started!", last.game);
                setGameStarted(true);
                break;

            case "ERROR":
                console.error(last.message);
                break;

            default:
                break;
        }
    }, [messages]);

    if (!gameCode) return <div>Creating game...</div>;
    if (gameStarted) return <div>Game Started! Ready to play.</div>;

    const startGame = () => {
        sendMessage({ type: "START_GAME" });
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <GameInvite code={gameCode} players={players} />
            <button
                onClick={startGame}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Start Game
            </button>
        </div>
    );
};
