import React from "react";
import Swal from "sweetalert2";
import { useGame } from "@features/game/model/useGame";
import { GameUserDTOType } from "shared";
import { gameEngine } from "@features/game/service/GameEngine";

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
    const { setPlayers } = useGame();
    const handleVersus = () => {
        const players: GameUserDTOType[] = [
            { id: 0, username: "Player 1", score: 0 },
            { id: 1, username: "Player 2", score: 0 },
        ];
        gameEngine.createPlayers(players);
        setPlayers(players);
    };
    const handleComputer = () => {
        const players: GameUserDTOType[] = [
            { id: 0, username: "Player 1", score: 0 },
            { id: 1, username: "Computer", score: 0 },
        ];
        gameEngine.createPlayers(players);
        setPlayers(players);
    };

    return (
        <div className="flex space-x-4 mb-2">
            <button
                onClick={handleVersus}
                className={`${defaultButton} bg-blue-600/20 hover:bg-blue-600/30`}
            >
                Versus
            </button>
            <button
                onClick={handleComputer}
                className={`${defaultButton} bg-green-600/20 hover:bg-green-600/30`}
            >
                Computer
            </button>
        </div>
    );
}

export const GameSettings = () => {
    return (
        <div className="flex flex-col items-center justify-center space-y-2">
            <Options />
            <MaxScoreSettings />
            <GameActions />
        </div>
    );
};
