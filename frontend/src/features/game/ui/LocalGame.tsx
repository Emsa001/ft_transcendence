import React, { useState, useRef, useEffect } from "react";
import { GameCanvas } from "./GameCanvas";
import { GameHeader } from "./GameHeader";
import { GameFooter } from "./GameFooter";
import { GameBackground } from "./GameBackground";
import { useKeyboard } from "./useKeyboard";
import { useGameState } from "./useGameState";

export function LocalGame() {
    const [scoreL, setScoreL] = useState(0);
    const [scoreR, setScoreR] = useState(0);
    const [paused, setPaused] = useState(true);
    const [showMessage, setShowMessage] = useState<string | null>(null);
    const [countdown, setCountdown] = useState<number | null>(null);
    const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const countdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { paddleL, paddleR, ball, resetBall, resetGame } = useGameState();

    const handleSpacePress = () => {
        if (!showMessage && !countdown) {
            setPaused((p) => !p);
        }
    };

    const keys = useKeyboard({ onSpacePress: handleSpacePress });

    const startCountdown = (ballDirection: boolean) => {
        setCountdown(3);
        setPaused(true);

        const runCountdown = (count: number) => {
            if (count > 0) {
                setCountdown(count);
                countdownTimeoutRef.current = setTimeout(() => {
                    runCountdown(count - 1);
                }, 1000);
            } else {
                setCountdown(null);
                setPaused(false);
                resetBall(ballDirection);
            }
        };

        runCountdown(3);
    };

    const handleScore = (scorer: "left" | "right") => {
        if (scorer === "left") {
            setScoreL((s) => s + 1);
            setShowMessage("Left Player Scores!");
        } else {
            setScoreR((s) => s + 1);
            setShowMessage("Right Player Scores!");
        }

        // Clear any existing timeout
        if (messageTimeoutRef.current) {
            clearTimeout(messageTimeoutRef.current);
        }

        // Show message for 3 seconds then start countdown
        messageTimeoutRef.current = setTimeout(() => {
            setShowMessage(null);
            startCountdown(scorer === "right"); // Ball goes to the player who didn't score
        }, 1000);
    };

    // Start or reset helpers
    const startGame = () => {
        if (showMessage || countdown) {
            // Clear any ongoing message or countdown
            setShowMessage(null);
            setCountdown(null);
            if (messageTimeoutRef.current) {
                clearTimeout(messageTimeoutRef.current);
            }
            if (countdownTimeoutRef.current) {
                clearTimeout(countdownTimeoutRef.current);
            }
        }

        startCountdown(Math.random() < 0.5);
    };

    const handleReset = () => {
        setScoreL(0);
        setScoreR(0);
        setShowMessage(null);
        setCountdown(null);
        if (messageTimeoutRef.current) {
            clearTimeout(messageTimeoutRef.current);
        }
        if (countdownTimeoutRef.current) {
            clearTimeout(countdownTimeoutRef.current);
        }
        resetGame();
        setPaused(true);
    };

    const handlePause = () => {
        if (!showMessage && !countdown) {
            setPaused((p) => !p);
        }
    };

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
    }, []);

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0520] via-[#110a2e] to-[#0b0b1a] text-white flex items-center justify-center p-6">
            <div className="w-full max-w-6xl h-[70vh] md:h-[78vh] relative rounded-2xl border border-white/10 shadow-2xl overflow-hidden bg-white/5 backdrop-blur-xl">
                <GameHeader
                    onPlay={startGame}
                    onPause={handlePause}
                    onReset={handleReset}
                    paused={paused}
                />

                {/* Canvas container keeps 16:9 ratio */}
                <div className="absolute inset-0 p-5 md:p-6">
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-fuchsia-600/10 via-indigo-500/10 to-sky-400/10 border border-white/10 shadow-inner overflow-hidden">
                        <GameCanvas
                            scoreL={scoreL}
                            scoreR={scoreR}
                            paused={paused}
                            keys={keys}
                            paddleL={paddleL}
                            paddleR={paddleR}
                            ball={ball}
                            onScore={handleScore}
                            showMessage={showMessage}
                            countdown={countdown}
                        />
                    </div>
                </div>

                <GameFooter />
                <GameBackground />
            </div>
        </div>
    );
}
