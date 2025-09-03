import { GameUserDTOType } from "shared";
import { CanvasMessage, GameState } from "../types";

export interface GameContextType {
    /** --- Players --- */
    players: GameUserDTOType[];
    setPlayers: ReactStateSetter<GameUserDTOType[]>;

    /** --- Config --- */
    maxScore: number;
    setMaxScore: ReactStateSetter<number>;

    /** --- Runtime State --- */
    state: GameState;
    setState: ReactStateSetter<GameState>;

    message: CanvasMessage[];
    setMessage: ReactStateSetter<CanvasMessage[]>;

    countdown: number | null;
    setCountdown: ReactStateSetter<number | null>;

    /** --- Timeouts / Refs --- */
    messageTimeoutRef: RefObject<NodeJS.Timeout | null>;
    countdownTimeoutRef: RefObject<NodeJS.Timeout | null>;

    /** --- Game Control Methods --- */
    startCountdown: () => Promise<void>;
    startGame: () => void;
    stopGame: () => void;
    togglePause: () => void;

    /** --- Event Callbacks --- */
    onScore?: (scorer: GameUserDTOType) => void;
    onEnd?: (winner: GameUserDTOType) => void;
    onSpace?: () => boolean;
}

/** --- Provider Props --- */
export interface GameProviderProps {
    children?: ReactNode;

    /** --- Initial Values --- */
    players?: GameUserDTOType[];
    maxScore?: number;

    /** --- Event Callbacks --- */
    onScore?: (scorer: GameUserDTOType) => void;
    onEnd?: (winner: GameUserDTOType) => void;
    onSpace?: () => boolean;
}
