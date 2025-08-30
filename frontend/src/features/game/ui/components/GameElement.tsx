import React from "react";
import { GameCanvasElement } from "./GameCanvas";
import { GameScore } from "./GameScore";

export const GameElement = () => {
    return (
        <div className="relative w-full max-h-[30rem] aspect-video flex-1">
            <GameCanvasElement />
            <GameScore />
        </div>
    );
};