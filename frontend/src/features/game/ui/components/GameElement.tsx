// GameElement.tsx
import React from "react";
import { GameScore } from "./GameScore";
import { GameCanvasLocal, GameCanvasRemote } from "./GameCanvas";
import { useGame } from "@features/game/model/useGame";
import { useRemoteGame } from "@features/game/model/useRemoteGame";

export const GameElementLocal = () => {
    const { players } = useGame();

    return (
        <div className="relative w-full max-h-[80%] aspect-video">
            <GameCanvasLocal />
            <GameScore players={players} />
        </div>
    );
};

export const GameElementRemote = () => {
    const { players } = useRemoteGame();

    return (
        <div className="relative w-full max-h-[80%] aspect-video">
            <GameCanvasRemote />
            <GameScore players={players} />
        </div>
    );
};
