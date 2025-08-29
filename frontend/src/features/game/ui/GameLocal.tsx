import React from "react";
import { GameElement } from "./components/GameElement";
import { GameFooter } from "./components/GameFooter";
import { GameStateProvider } from "../model/useGameState";
import { GameSettings } from "./components/GameSettings";

export const GameLocal = () => {
    return (
        <div className="w-full h-full">
            <GameStateProvider>
                <div className="flex flex-col items-center gap-6 px-2">
                    {/* Settings stays at top */}
                    <GameSettings />

                    {/* GameElement takes all remaining space */}
                    <GameElement />

                    {/* Footer stays at bottom */}
                    <GameFooter />
                </div>
            </GameStateProvider>
        </div>
    );
};
