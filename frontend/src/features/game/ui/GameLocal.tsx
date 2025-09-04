import React from "react";
import { GameElementLocal } from "./components/GameElement";
import { GameFooter } from "./components/GameFooter";
import { GameSettings } from "./components/GameSettings";
import { GameProvider } from "../model/useGame";

export const GameLocal = () => {
    return (
        <div className="w-full h-full">
            <GameProvider>
                <GameSettings />
                <GameElementLocal />
                <GameFooter />
            </GameProvider>
        </div>
    );
};
