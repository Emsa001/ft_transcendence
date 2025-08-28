import React, { useEffect } from "react";
import { useLocalGame } from "../model/useLocalGame";
import { GameCanvasElement } from "./GameCanvas";
import { GameScore } from "./GameScore";
import { GameUserDTOType } from "shared";
import { PongPlayer } from "../types";
import { GameFooter } from "./GameFooter";
import { useGameState } from "../model/useGameState";

interface GameElementProps {
    players?: GameUserDTOType[];
    onSpace?: () => boolean;
    onEnd?: (winner: PongPlayer) => void;
    onScore?: (scorer: PongPlayer) => void;
}

const defaultPlayers = [
    { id: 1, username: "Player 1" },
    { id: 2, username: "Player 2" },
] as GameUserDTOType[];

export const GameElement = ({
    players: externalPlayers,
    onSpace,
    onEnd,
    onScore,
}: GameElementProps) => {
    const gameState = useGameState(externalPlayers || defaultPlayers);

    const {
        messageTimeoutRef,
        countdownTimeoutRef,
        state,
        showMessage,
        countdown,
        keys,
        handleScore,
    } = useLocalGame({ onScore, onSpace, onEnd, gameState });

    useEffect(() => {
        return () => {
            if (messageTimeoutRef.current)
                clearTimeout(messageTimeoutRef.current);
            if (countdownTimeoutRef.current)
                clearTimeout(countdownTimeoutRef.current);
        };
    }, [messageTimeoutRef, countdownTimeoutRef]);

    return (
        <div className="w-full h-full">
            <div className="relative aspect-video w-full max-h-[65vh] mb-4">
                <GameCanvasElement
                    state={state}
                    keys={keys}
                    players={gameState.players}
                    ball={gameState.ball}
                    onScore={handleScore}
                    showMessage={showMessage}
                    countdown={countdown}
                />
                <GameScore players={gameState.players} />
            </div>
            <GameFooter players={gameState.players} />
        </div>
    );
};
