import { useRef, useState } from "react";
import { useKeyboard } from "./useKeyboard";
import { useGameState } from "./useGameState";
import { GameData, PongPlayer, PongPlayerInitial } from "../types";

interface UseLocalGameProps {
    maxScore?: number;
    players?: PongPlayerInitial[];
    onScore?: (scorer: PongPlayer) => void;
    onSpace?: () => boolean;
    onEnd?: (winner: PongPlayer) => void;
}

export const useLocalGame = (props?: UseLocalGameProps) => {
    const {
        maxScore = 1,
        players: initialPlayers,
        onScore,
        onSpace,
        onEnd,
    } = props || {};

    const gameState = useGameState(initialPlayers);

    const [state, setState] = useState<GameData["state"]>("created");

    const [showMessage, setShowMessage] = useState<string | null>(null);
    const [countdown, setCountdown] = useState<number | null>(null);
    const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const countdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleScore = (scorerId: string) => {
        // Find the player who scored
        const scorer = gameState.players.find((p) => p.id === scorerId);
        if (!scorer) return;

        // Update the scorer's score
        const newScore = scorer.score + 1;

        gameState.updatePlayerScore(scorerId, newScore);
        setShowMessage(`${scorer.name} Scores!`);

        // Call external onScore callback
        onScore?.({ ...scorer, score: newScore });

        // Check for winner
        if (newScore >= maxScore) {
            setShowMessage(`${scorer.name} Wins!`);
            setState("finished");
            onEnd?.({ ...scorer, score: newScore });
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
            const otherPlayerId = gameState.players.find(
                (p) => p.id !== scorerId
            )?.id;
            startCountdown().then(() => {
                gameState.resetBall(otherPlayerId);
                gameState.resetPaddles();
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
        gameState.resetGame();
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
        players: gameState.players,
        showMessage,
        countdown,
        keys,
        handleScore,
        startGame,
        handleReset,
        handlePause,
        gameState,
    };
};
