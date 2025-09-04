import { GameMessage, GameUserDTOType } from "shared";
import { GameState } from "../types";

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

    messages: RefObject<GameMessage[] | null>;
    countdown: RefObject<number | null>;

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
