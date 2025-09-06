import React, { useState } from "react";
import Swal from "sweetalert2";
import { useGame } from "@features/game/model/useGame";
import { GameUserDTOType } from "shared";
import { gameEngine } from "@features/game/service/GameEngine";
import { aiEngine, AiLevel } from "@features/game/service/AiEngine";

const defaultButton =
    "px-4 py-2 rounded-xl transition text-white font-bold shadow";

const MaxScoreSettings = () => {
    const { state, maxScore, setMaxScore } = useGame();

    const setScoreViaSwal = async () => {
        if (state !== "created") return;

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

    const isRunning = state != "created" && state != "finished";

    return (
        <button
            onClick={setScoreViaSwal}
            className={`bg-white/10 ${defaultButton} ${isRunning ? "opacity-50" : "hover:bg-white/15"}`}
        >
            Max Score: {maxScore}
        </button>
    );
};

const GameActions = () => {
    const { state, startGame, stopGame } = useGame();

    if (state == "started" || state == "paused") {
        return (
            <button
                className={`${defaultButton} hover:bg-red-600/30 bg-red-600/20`}
                onClick={stopGame}
            >
                End Game
            </button>
        );
    }

    return (
        <button
            className={`${defaultButton} hover:bg-purple-500/30 bg-purple-500/20`}
            onClick={startGame}
        >
            Start Game
        </button>
    );
};

function Options() {
    const { state, setPlayers } = useGame();

    const [mode, setMode] = useState<
        "versus" | "ai_easy" | "ai_hard" | "ai_impossible"
    >("versus");
    const isRunning = state != "created" && state != "finished";

    const handleChange = () => {
        if (isRunning) return;
        let players: GameUserDTOType[];
        if (mode === "versus") {
            players = [
                { id: 0, username: "Player 1", score: 0 },
                { id: 1, username: "Ai-Pong", score: 0 },
            ];
            aiEngine.level = AiLevel.EASY;
            setMode("ai_easy");
        } else if (mode === "ai_easy") {
            players = [
                { id: 0, username: "Player 1", score: 0 },
                { id: 1, username: "Ai-Pong", score: 0 },
            ];
            aiEngine.level = AiLevel.HARD;
            setMode("ai_hard");
        } else if (mode === "ai_hard") {
            players = [
                { id: 0, username: "Player 1", score: 0 },
                { id: 1, username: "Ai-Pong", score: 0 },
            ];
            aiEngine.level = AiLevel.IMPOSSIBLE;
            setMode("ai_impossible");
        } else {
            players = [
                { id: 0, username: "Player 1", score: 0 },
                { id: 1, username: "Player 2", score: 0 },
            ];
            aiEngine.level = AiLevel.EASY;
            setMode("versus");
        }
        gameEngine.createPlayers(players);
        setPlayers(players);
    };

    return (
        <button
            onClick={handleChange}
            className={`bg-white/10 ${defaultButton} ${isRunning ? "opacity-50" : "hover:bg-white/15"}`}
        >
            {mode}
        </button>
    );
}

export const GameSettings = () => {
    return (
        <div className="flex gap-4 items-center justify-center">
            <MaxScoreSettings />
            <GameActions />
            <Options />
        </div>
    );
};
