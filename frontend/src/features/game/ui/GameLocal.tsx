import React from "react";
import { GameElement } from "./components/GameElement";
import { GameFooter } from "./components/GameFooter";
import { GameSettings } from "./components/GameSettings";
import { GameProvider } from "../model/useGame";

export const GameLocal = () => {
    return (
        <div className="w-full h-full">
            <GameProvider>
                <GameSettings />
                <GameElement />
                <GameFooter />
            </GameProvider>
        </div>
    );
};
