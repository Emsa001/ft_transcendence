import React, { createContext, useContext, useRef, useState } from "react";
import { PongPlayer } from "../types";
import { GameUserDTOType } from "shared";
import { createPongPlayers } from "../service/GameUitls";

interface GameStateContextType {
    players: PongPlayer[];
    resetGame: () => void;
    addPoint: (playerId: string) => void;
    maxScore: number;
    setMaxScore: (score: number | ((prev: number) => number)) => void;

    // Event Callbacks
    onScore?: (scorer: PongPlayer) => void;
    onEnd?: (winner: PongPlayer) => void;
    onSpace?: () => boolean;
}

const GameStateContext = createContext<GameStateContextType | undefined>(
    undefined
);

/** --- Provider --- */
interface GameStateProviderProps {
    children?: ReactNode;
    playersConfig?: GameUserDTOType[];
    maxScore?: number;

    // Event Callbacks
    onScore?: (scorer: PongPlayer) => void;
    onEnd?: (winner: PongPlayer) => void;
    onSpace?: () => boolean;
}

export const GameStateProvider = ({
    children,
    playersConfig,
    maxScore = 5,

    onScore,
    onEnd,
    onSpace,
}: GameStateProviderProps) => {
    const [maxScoreValue, setMaxScore] = useState(maxScore);

    /** --- State --- */
    const [players, setPlayers] = useState<PongPlayer[]>(
        createPongPlayers(playersConfig)
    );

    const resetGame = () => {
        setPlayers((prev) =>
            prev.map((p) => ({
                ...p,
                score: 0,
            }))
        );
    };

    const addPoint = (playerId: string) => {
        setPlayers((prev) =>
            prev.map((p) =>
                p.id === playerId ? { ...p, score: p.score + 1 } : p
            )
        );
    };

    const returnValue: GameStateContextType = {
        players,
        resetGame,
        addPoint,

        maxScore: maxScoreValue,
        setMaxScore,

        // Callbacks
        onScore,
        onEnd,
        onSpace,
    };

    return (
        <div className="w-full h-full p-4">
            <GameStateContext.Provider value={returnValue}>
                <div className="w-full h-full flex flex-col items-center justify-center gap-6">
                    {children}
                </div>
            </GameStateContext.Provider>
        </div>
    );
};

export const useGameState = (): GameStateContextType => {
    const context = useContext(GameStateContext);
    if (!context) {
        throw new Error("useGameContext must be used inside GameStateProvider");
    }
    return context;
};
