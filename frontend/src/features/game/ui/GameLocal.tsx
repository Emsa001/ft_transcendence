import React from "react";
import { GameElement } from "./components/GameElement";
import { GameFooter } from "./components/GameFooter";
import { GameStateProvider } from "../model/useGameState";
import { GameSettings } from "./components/GameSettings";

export const GameLocal = () => {
    return (
        <div className="w-full h-full">
            <GameStateProvider>
                {/* Settings stays at top */}
                <div className="shrink-0 w-full flex justify-center">
                    <GameSettings />
                </div>

                {/* GameElement takes all remaining space */}
                <div className="flex-1 w-full flex justify-center items-center overflow-hidden">
                    <GameElement />
                </div>

                {/* Footer stays at bottom */}
                <div className="shrink-0 w-full flex justify-center">
                    <GameFooter />
                </div>
            </GameStateProvider>
        </div>
    );
};
