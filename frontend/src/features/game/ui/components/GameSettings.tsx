import React from "react";
import { useGameState } from "@features/game/model/useGameState";
import { Icon } from "@shared/components/Icon";
import { FaMinus, FaPlus } from "react-icons/fa";

export const GameSettings = () => {
    const { maxScore, setMaxScore } = useGameState();

    const decrease = () => setMaxScore((prev) => Math.max(1, prev - 1));
    const increase = () => setMaxScore((prev) => Math.min(21, prev + 1));

    return (
        <div className="absolute z-10 left-0 flex flex-col items-center gap-4 p-2 rounded-2xl bg-purple-900/10 shadow-lg">
            <button
                onClick={decrease}
                className={`p-2 rounded-xl bg-red-400/20 hover:bg-red-500/50 transition text-white shadow ${maxScore <= 1 && "cursor-not-allowed! bg-red-900/20 hover:bg-red-900/30"}`}
            >
                <Icon icon={FaMinus} size={20} />
            </button>

            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="inline-block w-8 text-center">{maxScore}</span>
            </h1>

            <button
                onClick={increase}
                className={`p-2 rounded-xl bg-green-400/20 hover:bg-green-500/50 transition text-white shadow ${maxScore >= 21 && "cursor-not-allowed! bg-green-900/20 hover:bg-green-900/30"}`}
            >
                <Icon icon={FaPlus} size={20} />
            </button>
        </div>
    );
};
