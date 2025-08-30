import React from "react";
import { GameCanvasElement } from "./GameCanvas";
import { GameScore } from "./GameScore";

export const GameElement = () => {
    return (
        <div className="relative w-full h-full flex-1">
            <GameCanvasElement />
            <GameScore />
        </div>
    );
};
