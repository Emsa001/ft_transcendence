import { useRef, useState } from "react";
import { useKeyboard } from "@shared/hooks/useKeyboard";
import { useGameState } from "../context/useGameState";
import { GameData } from "../types";

export const useGame = () => {
    const {
        maxScore,
        players,
        updatePlayerScore,
        resetBall,
        resetGame,
        resetPaddles,

        onScore,
        onEnd,
        onSpace,
    } = useGameState();

    const [state, setState] = useState<GameData["state"]>("created");

    const [showMessage, setShowMessage] = useState<string | null>(null);
    const [countdown, setCountdown] = useState<number | null>(null);
    const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const countdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleScore = (scorerId: string) => {
        // Find the player who scored
        const scorer = players.find((p) => p.id === scorerId);
        if (!scorer) return;

        // Update the scorer's score
        const newScore = scorer.score + 1;

        updatePlayerScore(scorerId, newScore);
        setShowMessage(`${scorer.username} Scores!`);

        // Call external onScore callback
        onScore?.({ ...scorer, score: newScore });

        // Check for winner
        if (newScore >= maxScore) {
            setShowMessage(`${scorer.username} Wins!`);
            setState("finished");

            onEnd?.(scorer);
            return;
        }

        // Clear any existing timeout
        if (messageTimeoutRef.current) {
            clearTimeout(messageTimeoutRef.current);
        }

        // Show message for 1 second then start countdown
        messageTimeoutRef.current = setTimeout(() => {
            setShowMessage(null);
            // Ball goes away from the player who scored
            const otherPlayerId = players.find((p) => p.id !== scorerId)?.id;
            startCountdown().then(() => {
                resetBall(otherPlayerId);
                resetPaddles();
            });
        }, 1000);
    };

    // Start or reset helpers
    const startGame = () => {
        if (showMessage || countdown) {
            // Clear any ongoing message or countdown
            if (messageTimeoutRef.current)
                clearTimeout(messageTimeoutRef.current);
            if (countdownTimeoutRef.current)
                clearTimeout(countdownTimeoutRef.current);

            setShowMessage(null);
            setCountdown(null);
        }

        setState("started");
        startCountdown();
    };

    const handleReset = () => {
        if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
        if (countdownTimeoutRef.current)
            clearTimeout(countdownTimeoutRef.current);

        setShowMessage(null);
        setCountdown(null);
        setState("created");
        resetGame();
    };

    const handlePause = () => {
        if (showMessage || countdown || state !== "started") return;
        setState("paused");
    };

    const handleSpacePress = () => {
        if (onSpace?.() == false) return;

        switch (state) {
            case "finished":
                handleReset();
                break;
            case "created":
            case "paused":
                startGame();
                break;
            case "started":
                handlePause();
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
        showMessage,
        countdown,
        keys,
        handleScore,
        startGame,
        handleReset,
        handlePause,
    };
};
