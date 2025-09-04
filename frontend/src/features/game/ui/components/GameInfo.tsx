import { useGame } from "@features/game/model/useGame";
import React from "react";

export const GameInfo = () => {
    const { state, maxScore } = useGame();

    return (
        <button
            className={`bg-white/10 px-4 py-2 rounded-xl transition text-white font-bold shadow`}
        >
            Max Score: {maxScore}
        </button>
    );
};
