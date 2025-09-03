import React, { createContext, useContext, useEffect, useState } from "react";
import { GameUserDTOType } from "shared";
import { gameEngine } from "../service/GameEngine";
import { GameState } from "../types";
import { useGameKeys } from "./useGameKeys";
import { GameContextType, GameProviderProps } from "./useGameTypes";
import { useGameMessages } from "./useGameMessages";

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = (): GameContextType => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGame must be used inside GameStateProvider");
    }
    return context;
};

export const GameProvider = ({
    children,
    players,
    maxScore = 5,
    onScore,
    onEnd,
    onSpace,
}: GameProviderProps) => {
    const [playersValue, setPlayers] = useState<GameUserDTOType[]>([]);
    const [maxScoreValue, setMaxScore] = useState(maxScore);
    const [state, setState] = useState<GameState>("created");

    useEffect(() => {
        setPlayers(gameEngine.createPlayers(players));
    }, []);

    const {
        message,
        setMessage,
        countdown,
        setCountdown,
        messageTimeoutRef,
        countdownTimeoutRef,
        showMessage,
        startCountdown,
    } = useGameMessages();

    // --- Game Flow ---
    const handleScore = (scorerId: number) => {
        const scorer = playersValue.find((p) => p.id === scorerId);
        if (!scorer) return;

        gameEngine.stopped = true;
        const newScore = scorer.score + 1;

        setPlayers((prev) =>
            prev.map((p) => (p.id === scorerId ? { ...p, score: newScore } : p))
        );
        onScore?.({ ...scorer, score: newScore });

        if (newScore >= maxScoreValue) {
            setState("finished");
            onEnd?.(scorer);
            setMessage([
                {
                    text: `${scorer.username} Wins!`,
                    shadow: { color: "#7a5cff", blur: 20 },
                    size: 60,
                },
                { text: `Press Space to Restart`, size: 30 },
            ]);
            return;
        }

        showMessage(
            [
                {
                    text: `${scorer.username} Scores!`,
                    shadow: { color: "#7a5cff", blur: 20 },
                    size: 50,
                },
            ],
            1000,
            () =>
                startCountdown().then(() => {
                    gameEngine.resetPositions();
                    gameEngine.stopped = false;
                })
        );
    };

    const stopGame = () => {
        if (countdown) return;

        clearTimeout(messageTimeoutRef.current!);
        clearTimeout(countdownTimeoutRef.current!);

        setMessage([]);
        setCountdown(null);
        setPlayers((prev) => prev.map((p) => ({ ...p, score: 0 })));
        setState("created");

        gameEngine.resetPositions();
        gameEngine.stopped = true;
    };

    const startGame = () => {
        if (countdown) return;

        stopGame();
        setState("started");
        startCountdown().then(() => (gameEngine.stopped = false));

        gameEngine.resetPositions();
    };

    const togglePause = () => {
        if (countdown || message.length > 0) return;
        setState((prev) => (prev === "started" ? "paused" : "started"));
        gameEngine.stopped = !gameEngine.stopped;
    };

    const handleSpacePress = () => {
        if (onSpace?.() === false) return;
        if (state === "created" || state === "finished") startGame();
        else togglePause();
    };

    // --- Hooks ---
    useEffect(() => {
        gameEngine.onScore = handleScore;
    }, [playersValue, maxScoreValue]);

    useGameKeys({ onSpacePress: handleSpacePress });

    // --- Context Value ---
    const value: GameContextType = {
        players: playersValue,
        maxScore: maxScoreValue,
        messageTimeoutRef,
        countdownTimeoutRef,
        state,
        message,
        countdown,

        stopGame,
        startGame,
        togglePause,

        setPlayers,
        setMaxScore,
        setMessage,
        setState,
        setCountdown,
        startCountdown,
    };

    return (
        <div className="w-full h-full p-4">
            <GameContext.Provider value={value}>
                <div className="w-full h-full flex flex-col items-center justify-center gap-6">
                    {children}
                </div>
            </GameContext.Provider>
        </div>
    );
};
