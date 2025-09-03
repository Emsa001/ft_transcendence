import { useWebSocket } from "@shared/hooks/websocket";
import React, { useState, useEffect } from "react";
import GameApi from "../service/api";

export const GameRemote = () => {
    const [code, setCode] = useState<string | null>(null);

    // 1️⃣ Create game when component mounts
    useEffect(() => {
        const createGame = async () => {
            try {
                const res = await GameApi.createGame();
                setCode(res.data.code); // assume server returns { code: 'ABC123' }
            } catch (err) {
                console.error("Failed to create game", err);
            }
        };
        createGame();
    }, []);

    // 2️⃣ Only connect WebSocket once we have a code
    const { messages, sendMessage, isConnected } = useWebSocket(
        code ? `ws://localhost:3000/game/${code}` : ""
    );

    // 3️⃣ Notify server that we joined the game
    useEffect(() => {
        if (isConnected && code) {
            sendMessage({ type: "JOIN_GAME", code });
        }
    }, [isConnected, code, sendMessage]);

    // 4️⃣ Handle incoming WebSocket messages
    useEffect(() => {
        const last = messages[messages.length - 1];
        if (!last) return;

        if (last.type === "PLAYER_JOINED") {
            console.log("Friend joined:", last.player);
            // trigger UI state change to start the game
        }
    }, [messages]);

    if (!code) return <div>Creating game...</div>;

    return (
        <div className="w-full h-full">
            <GameInvite code={code} />
        </div>
    );
};

export const GameInvite = ({ code }: { code: string }) => {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Invite a Friend</h2>
                <p className="mb-4">
                    Share the link below to invite a friend to join your game:
                </p>
                <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/join/${code}`}
                    className="w-full p-2 border border-gray-300 rounded"
                    onFocus={(e: any) => e.target.select()}
                />
                <p className="mt-4 text-sm text-gray-500">
                    Waiting for your friend to join...
                </p>
            </div>
        </div>
    );
};
