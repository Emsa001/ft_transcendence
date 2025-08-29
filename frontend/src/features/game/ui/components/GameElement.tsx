import React from "react";
import { GameCanvasElement } from "./GameCanvas";
import { GameScore } from "./GameScore";

export const GameElement = () => {
    return (
        <div className="relative w-full h-full aspect-video max-h-[65vh]">
            <GameCanvasElement />
            <GameScore />
        </div>
    );
};
