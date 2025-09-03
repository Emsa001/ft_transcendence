import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { GameUserDTOType } from "shared";
import { gameEngine } from "../service/GameEngine";

interface GameStateContextType {
    players: GameUserDTOType[];
    resetGame: () => void;
    addPoint: (playerId: number) => void;
    maxScore: number;
    setMaxScore: (score: number | ((prev: number) => number)) => void;

    // Event Callbacks
    onScore?: (scorer: GameUserDTOType) => void;
    onEnd?: (winner: GameUserDTOType) => void;
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
    onScore?: (scorer: GameUserDTOType) => void;
    onEnd?: (winner: GameUserDTOType) => void;
    onSpace?: () => boolean;
}

const createPlayers = (players?: GameUserDTOType[]) => {
    if (!players)
        players = [
            { id: 0, username: "Player 1", score: 0 },
            { id: 1, username: "Player 2", score: 0 },
        ];
    gameEngine.initPlayers(players);

    return players;
};

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
    const [players, setPlayers] = useState<GameUserDTOType[]>(
        createPlayers(playersConfig)
    );

    const resetGame = () => {
        setPlayers((prev) =>
            prev.map((p) => ({
                ...p,
                score: 0,
            }))
        );
    };

    const addPoint = (playerId: number) => {
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
