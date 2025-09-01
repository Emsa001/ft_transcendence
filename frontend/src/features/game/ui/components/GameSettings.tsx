import { useGameState } from "@features/game/context/useGameState";
import React from "react";
import Swal from "sweetalert2";

const MaxScoreSettings = () => {
    const { maxScore, setMaxScore } = useGameState();

    const setScoreViaSwal = async () => {
        const { value: newScore } = await Swal.fire({
            title: "Set Max Score",
            theme: "dark",
            input: "number",
            inputLabel: "Max Score (1-21)",
            inputValue: maxScore,
            inputAttributes: {
                min: "1",
                max: "21",
                step: "1",
            },
            showCancelButton: true,
        });

        if (newScore !== undefined) {
            const parsed = Math.max(1, Math.min(21, Number(newScore)));
            setMaxScore(parsed);
        }
    };

    return (
        <button
            onClick={setScoreViaSwal}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition text-white font-bold shadow"
        >
            Max Score: {maxScore}
        </button>
    );
};

export const GameSettings = () => {
    return (
        <div className="">
            <MaxScoreSettings />
        </div>
    );
};
