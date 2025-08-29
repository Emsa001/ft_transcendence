import React, { useEffect } from "react";
import { useGame } from "../model/useGame";
import { GameCanvasElement } from "./GameCanvas";
import { GameScore } from "./components/GameScore";
import { PongPlayer } from "../types";

interface GameElementProps {
    onSpace?: () => boolean;
    onEnd?: (winner: PongPlayer) => void;
    onScore?: (scorer: PongPlayer) => void;
}

export const GameElement = ({ onSpace, onEnd, onScore }: GameElementProps) => {
    const {
        messageTimeoutRef,
        countdownTimeoutRef,
        state,
        showMessage,
        countdown,
        keys,
        handleScore,
    } = useGame({ onScore, onSpace, onEnd });

    useEffect(() => {
        return () => {
            if (messageTimeoutRef.current)
                clearTimeout(messageTimeoutRef.current);
            if (countdownTimeoutRef.current)
                clearTimeout(countdownTimeoutRef.current);
        };
    }, [messageTimeoutRef, countdownTimeoutRef]);

    return (
        <div className="aspect-video w-full max-h-[65vh] mb-4">
            <GameCanvasElement
                state={state}
                keys={keys}
                onScore={handleScore}
                showMessage={showMessage}
                countdown={countdown}
            />
            <GameScore />
        </div>
    );
};
