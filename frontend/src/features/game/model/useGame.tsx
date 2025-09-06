import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { GameMessages, GameUserDTOType } from "shared";
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
    const lockRef = useRef(false);

    useEffect(() => {
        setPlayers(gameEngine.createPlayers(players));
    }, []);

    const {
        messages,
        countdown,

        showMessage,
        startCountdown,
    } = useGameMessages();

    // events
    const stopGame = () => {
        if (countdown.current) return;

        messages.current = GameMessages.start();

        setPlayers((prev) => prev.map((p) => ({ ...p, score: 0 })));
        setState("created");

        gameEngine.resetPositions();
        gameEngine.stopped = true;
    };

    const startGame = () => {
        if (countdown.current) return;

        stopGame();
        setState("started");
        startCountdown().then(() => (gameEngine.stopped = false));
        messages.current = null;

        gameEngine.resetPositions();
    };

    // Only for local game
    const togglePause = () => {
        if (countdown.current || lockRef.current) return;
        if (state === "created" || state === "finished") return;

        setState((prev) => (prev === "started" ? "paused" : "started"));
        if (gameEngine.stopped) {
            messages.current = null;
        } else {
            messages.current = GameMessages.pause();
        }

        gameEngine.stopped = !gameEngine.stopped;
    };

    // Only for local game
    const handleSpacePress = () => {
        if (onSpace?.() === false) return;

        if (state === "created" || state === "finished") startGame();
        else togglePause();
    };

    // Only for local game
    const handleScore = (scorerId: number) => {
        const scorer = playersValue.find((p) => p.id === scorerId);
        if (!scorer) return;

        const newScore = scorer.score + 1;
        gameEngine.stopped = true;
        lockRef.current = true;

        setPlayers((prev) =>
            prev.map((p) => (p.id === scorerId ? { ...p, score: newScore } : p))
        );
        onScore?.({ ...scorer, score: newScore });

        if (newScore >= maxScoreValue) {
            setState("finished");
            onEnd?.(scorer);
            messages.current = GameMessages.win(scorer.username, true);
            return;
        }

        showMessage({
            message: GameMessages.score(scorer.username),
            duration: 1000,
            after: () =>
                startCountdown().then(() => {
                    gameEngine.resetPositions();
                    gameEngine.stopped = false;
                    lockRef.current = false;
                }),
        });
    };

    const onRandomEvent = (event: string) => {
        showMessage({
            message: GameMessages.event(event),
            duration: 1000,
        });
    };

    // keep handleScore up to date
    useEffect(() => {
        gameEngine.onScore = handleScore;
    }, [playersValue, maxScoreValue]);

    useEffect(() => {
        messages.current = GameMessages.start();
        gameEngine.onRandomEvent = onRandomEvent;

        return () => {
            gameEngine.resetPositions();
            gameEngine.stopped = true;
            gameEngine.onScore = undefined;
        };
    }, []);

    // register space
    const keys = useGameKeys({ onSpacePress: handleSpacePress });

    useEffect(() => {
        gameEngine.keys = keys;
    }, [keys]);

    const value: GameContextType = {
        players: playersValue,
        maxScore: maxScoreValue,
        state,
        messages,
        countdown,

        stopGame,
        startGame,
        togglePause,

        setPlayers,
        setMaxScore,
        setState,
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
