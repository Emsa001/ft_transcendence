import { useEffect, useRef, useState } from "react";
import { useKeyboard } from "./useKeyboard";
import { useGameState } from "./useGameState";
import { CanvasMessage, GameState } from "../types";
import { gameEngine } from "../service/GameEngine";

export const useGame = () => {
    const {
        maxScore,
        players,
        addPoint,
        resetGame,

        onScore,
        onEnd,
        onSpace,
    } = useGameState();

    const [state, setState] = useState<GameState>("created");

    const [message, setMessage] = useState<CanvasMessage[]>([]);
    const [countdown, setCountdown] = useState<number | null>(null);
    const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const countdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        gameEngine.onScore = handleScore;
    }, [players, maxScore]);

    const handleScore = (scorerId: number) => {
        const scorer = players.find((p) => p.id === scorerId);
        if (!scorer) return;

        gameEngine.stopped = true;
        const newScore = scorer.score + 1;

        setMessage([
            {
                text: `${scorer.username} Scores!`,
                shadow: {
                    color: "#7a5cff",
                    blur: 20,
                },
                size: 50,
            },
        ]);

        addPoint(scorerId);
        onScore?.({ ...scorer, score: newScore });

        if (newScore >= maxScore) {
            setMessage([
                {
                    text: `${scorer.username} Wins!`,
                    shadow: {
                        color: "#7a5cff",
                        blur: 20,
                    },
                    size: 60,
                },
                {
                    text: `Press Space to Restart`,
                    size: 30,
                },
            ]);
            setState("finished");
            onEnd?.(scorer);
            return;
        }

        messageTimeoutRef.current = setTimeout(() => {
            setMessage([]);
            startCountdown().then(() => {
                gameEngine.stopped = false;
            });
        }, 1000);
    };

    // Start or reset helpers
    const startGame = () => {
        if (countdown) return;

        if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
        if (countdownTimeoutRef.current)
            clearTimeout(countdownTimeoutRef.current);

        setMessage([]);
        setCountdown(null);

        resetGame();
        gameEngine.reset();

        setState("started");
        startCountdown().then(() => {
            gameEngine.stopped = false;
        });
    };

    const togglePause = () => {
        if (countdown || message.length > 0) return;
        setState((prev) => (prev === "started" ? "paused" : "started"));
        gameEngine.stopped = !gameEngine.stopped;
    };

    const handleSpacePress = () => {
        if (onSpace?.() == false) return;

        switch (state) {
            case "created":
            case "finished":
                startGame();
                break;
            case "started":
            case "paused":
                togglePause();
                break;
        }
    };

    const keys = useKeyboard({ onSpacePress: handleSpacePress });

    const startCountdown = (): Promise<void> => {
        return new Promise((resolve) => {
            setCountdown(3);

            const runCountdown = (count: number) => {
                if (count > 0) {
                    setCountdown(count);
                    countdownTimeoutRef.current = setTimeout(() => {
                        runCountdown(count - 1);
                    }, 1000);
                } else {
                    setCountdown(null);
                    resolve();
                }
            };

            runCountdown(3);
        });
    };

    return {
        messageTimeoutRef,
        countdownTimeoutRef,
        state,
        message,
        countdown,
        keys,
        startGame,
    };
};
