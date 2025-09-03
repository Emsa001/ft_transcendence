// GameElement.tsx
import React from "react";
import { GameCanvasElement } from "./GameCanvas";
import { GameScore } from "./GameScore";

export const GameElement = () => {
    return (
        <div className="relative w-full max-h-[80%] aspect-video">
            <GameCanvasElement />
            <GameScore />
        </div>
    );
};
