import { GameMessage, GameUserDTOType, MessageData } from "shared";
import { GameState } from "../types";

export interface GameContextType {
    /** --- Players --- */
    players: GameUserDTOType[];
    setPlayers: SetState<GameUserDTOType[]>;

    /** --- Config --- */
    maxScore: number;
    setMaxScore: SetState<number>;

    /** --- Runtime State --- */
    state: GameState;
    setState: SetState<GameState>;

    messages: RefObject<MessageData | null>;
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
