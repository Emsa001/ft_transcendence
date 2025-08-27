import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { useKeyboard } from "./useKeyboard";
import { useGameState } from "./useGameState";

interface LocalGameProviderProps {
    children?: JSX.Element;
}

export const LocalGameProvider = ({ children }: LocalGameProviderProps) => {
    const gameState = useGameState();

    const [isStarted, setIsStarted] = useState(false);
    const [scoreL, setScoreL] = useState(0);
    const [scoreR, setScoreR] = useState(0);
    const [paused, setPaused] = useState(false);
    const [showMessage, setShowMessage] = useState<string | null>(null);
    const [countdown, setCountdown] = useState<number | null>(null);
    const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const countdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleScore = (scorer: "left" | "right") => {
        let newScoreL = scoreL;
        let newScoreR = scoreR;

        if (scorer === "left") {
            newScoreL = scoreL + 1;
            setScoreL(newScoreL);
            setShowMessage("Left Player Scores!");
        } else {
            newScoreR = scoreR + 1;
            setScoreR(newScoreR);
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
            if (messageTimeoutRef.current)
                clearTimeout(messageTimeoutRef.current);
            if (countdownTimeoutRef.current)
                clearTimeout(countdownTimeoutRef.current);

            setShowMessage(null);
            setCountdown(null);
        }

        setIsStarted(true);
        startCountdown(Math.random() < 0.5);
    };

    const handleReset = () => {
        if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
        if (countdownTimeoutRef.current)
            clearTimeout(countdownTimeoutRef.current);

        setScoreL(0);
        setScoreR(0);
        setShowMessage(null);
        setCountdown(null);
        setIsStarted(false);
        gameState.resetGame();
        setPaused(false);
    };

    const handlePause = () => {
        if (showMessage || countdown || !isStarted) return;
        setPaused((p) => !p);
    };

    const handleSpacePress = () => {
        if (!isStarted) {
            startGame();
        } else {
            handlePause();
        }
    };

    const keys = useKeyboard({ onSpacePress: handleSpacePress });

    const startCountdown = (ballDirection: boolean) => {
        setCountdown(3);

        const runCountdown = (count: number) => {
            if (count > 0) {
                setCountdown(count);
                countdownTimeoutRef.current = setTimeout(() => {
                    runCountdown(count - 1);
                }, 1000);
            } else {
                setCountdown(null);
                gameState.resetBall(ballDirection);
            }
        };

        runCountdown(3);
    };

    return (
        <div>
            <LocalGameContext.Provider
                value={{
                    messageTimeoutRef,
                    countdownTimeoutRef,

                    isStarted,
                    scoreL,
                    scoreR,
                    paused,
                    showMessage,
                    countdown,
                    keys,
                    startGame,
                    handlePause,
                    handleReset,
                    handleScore,
                    gameState,
                }}
            >
                {children}
            </LocalGameContext.Provider>
        </div>
    );
};

interface LocalGameContextType {
    isStarted: boolean;
    scoreL: number;
    scoreR: number;
    paused: boolean;
    showMessage: string | null;
    countdown: number | null;
    keys: {
        up: boolean;
        down: boolean;
        w: boolean;
        s: boolean;
        space: boolean;
    };
    startGame: () => void;
    handlePause: () => void;
    handleReset: () => void;
    handleScore: (scorer: "left" | "right") => void;
    gameState: ReturnType<typeof useGameState>;
    messageTimeoutRef: { current: NodeJS.Timeout | null };
    countdownTimeoutRef: { current: NodeJS.Timeout | null };
}

export const LocalGameContext = createContext<LocalGameContextType | null>(
    null
);

export const useLocalGame = () => {
    const context = useContext(LocalGameContext);
    if (context === null) {
        throw new Error("useLocalGame must be used within a LocalGameProvider");
    }
    return context;
};
