import React from "react";
import { GameElement } from "./GameElement";
import { GameFooter } from "./components/GameFooter";
import { GameStateProvider } from "../model/useGameState";
import { GameSettings } from "./components/GameSettings";

const defaultPlayers = [
    { id: 1, username: "Player 1" },
    { id: 2, username: "Player 2" },
];

export const GameLocal = () => {
    return (
        <div className="w-full h-full">
            <GameStateProvider playersConfig={defaultPlayers as any}>
                <div className="w-full h-full flex items-center justify-center gap-6">
                    {/* Game */}
                    <GameElement />
                    <GameFooter />
                    <GameSettings />
                </div>
            </GameStateProvider>
        </div>
    );
};
