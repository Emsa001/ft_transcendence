import { GameUserDTOType } from "shared";
import { CanvasMessage, GameState } from "../types";

export interface GameContextType {
    players: GameUserDTOType[];
    setPlayers: (
        players:
            | GameUserDTOType[]
            | ((prev: GameUserDTOType[]) => GameUserDTOType[])
    ) => void;

    maxScore: number;
    setMaxScore: (score: number | ((prev: number) => number)) => void;

    // Game Control
    state: GameState;
    message: CanvasMessage[];
    countdown: number | null;

    messageTimeoutRef: RefObject<NodeJS.Timeout | null>;
    countdownTimeoutRef: RefObject<NodeJS.Timeout | null>;

    setMessage: (
        message: CanvasMessage[] | ((prev: CanvasMessage[]) => CanvasMessage[])
    ) => void;
    setState: (state: GameState | ((prev: GameState) => GameState)) => void;
    setCountdown: (
        count: number | null | ((prev: number | null) => number | null)
    ) => void;

    startCountdown: () => Promise<void>;

    // Event Callbacks
    onScore?: (scorer: GameUserDTOType) => void;
    onEnd?: (winner: GameUserDTOType) => void;
    onSpace?: () => boolean;
}

/** --- Provider --- */
export interface GameProviderProps {
    children?: ReactNode;
    players?: GameUserDTOType[];
    maxScore?: number;

    // Event Callbacks
    onScore?: (scorer: GameUserDTOType) => void;
    onEnd?: (winner: GameUserDTOType) => void;
    onSpace?: () => boolean;
}
