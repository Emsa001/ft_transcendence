import React from "react";
import { GameElement } from "./components/GameElement";
import { GameFooter } from "./components/GameFooter";
import { GameStateProvider } from "../model/useGameState";
import { GameSettings } from "./components/GameSettings";

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
