import React from "react";
import { GameElement } from "./components/GameElement";
import { GameFooter } from "./components/GameFooter";
import { GameSettings } from "./components/GameSettings";
import { GameStateProvider } from "../context/useGameState";

export const GameLocal = () => {
    return (
        <div className="w-full h-full">
            <GameStateProvider>
                <GameSettings />
                <GameElement />
                <GameFooter />
            </GameStateProvider>
        </div>
    );
};
