import React, { useEffect } from "react";
import { useLocalGame } from "../model/useLocalGame";
import { GameCanvasElement } from "./GameCanvas";
import { GameScore } from "./GameScore";
import { GameUserDTOType } from "shared";
import { PongPlayer } from "../types";

interface GameElementProps {
    players?: GameUserDTOType[];
    onSpace?: () => boolean;
    onEnd?: (winner: PongPlayer) => void;
    onScore?: (scorer: PongPlayer) => void;
}

export const GameElement = ({
    players: externalPlayers,
    onSpace,
    onEnd,
    onScore,
}: GameElementProps) => {
    const gamePlayersConfig = externalPlayers?.map((player, i) => ({
        name: player.username || `Player ${i + 1}`,
        controls:
            i === 0
                ? { up: "w", down: "s" }
                : { up: "arrowup", down: "arrowdown" },
    }));

    const data = useLocalGame({
        players: gamePlayersConfig,
        onScore,
        onSpace,
        onEnd,
    });

    const {
        messageTimeoutRef,
        countdownTimeoutRef,
        state,
        players,
        showMessage,
        countdown,
        keys,
        handleScore,
        gameState: { ball },
    } = data;

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            if (messageTimeoutRef.current) {
                clearTimeout(messageTimeoutRef.current);
            }
            if (countdownTimeoutRef.current) {
                clearTimeout(countdownTimeoutRef.current);
            }
        };
    }, [messageTimeoutRef, countdownTimeoutRef]);

    return (
        <div className="relative aspect-video w-full max-h-[60vh]">
            <GameCanvasElement
                state={state}
                keys={keys}
                players={players}
                ball={ball}
                onScore={handleScore}
                showMessage={showMessage}
                countdown={countdown}
            />
            <GameScore players={players} />
        </div>
    );
};
