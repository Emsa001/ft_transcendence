import React, { useState } from "react";
import { useGame } from "@features/game/model/useGame";
import { GameUserDTOType } from "shared";
import { gameEngine } from "@features/game/service/GameEngine";
import { aiEngine, AiLevel } from "@features/game/service/AiEngine";

import { Modal } from "@shared/components/Modal";

interface TwoFaModalProps {
    modalOpen: boolean;
    setModalOpen: (open: boolean) => void;
}

type Mode = "versus" | "ai_easy" | "ai_hard" | "ai_impossible";

export function OptionsModal({ modalOpen, setModalOpen }: TwoFaModalProps) {
    const { state, maxScore, setMaxScore, setPlayers } = useGame();

    const [selectedMode, setSelectedMode] = useState<Mode | null>(null);

    const isRunning = state != "created" && state != "finished";

    const handleChange = (mode: Mode) => {
        if (isRunning) return;
        setSelectedMode(mode);
        let players: GameUserDTOType[];
        if (mode === "versus") {
            players = [
                { id: 0, username: "Player 1", score: 0 },
                { id: 1, username: "Player 2", score: 0 },
            ];
            aiEngine.level = AiLevel.EASY;
        } else if (mode === "ai_easy") {
            players = [
                { id: 0, username: "Player 1", score: 0 },
                { id: 1, username: "Ai-Pong", score: 0 },
            ];
            aiEngine.level = AiLevel.EASY;
        } else if (mode === "ai_hard") {
            players = [
                { id: 0, username: "Player 1", score: 0 },
                { id: 1, username: "Ai-Pong", score: 0 },
            ];
            aiEngine.level = AiLevel.HARD;
        } else {
            players = [
                { id: 0, username: "Player 1", score: 0 },
                { id: 1, username: "Ai-Pong", score: 0 },
            ];
            aiEngine.level = AiLevel.IMPOSSIBLE;
        }
        gameEngine.createPlayers(players);
        setPlayers(players);
    };

    const handleRandomEvent = () => {
        gameEngine.randomEvents = !gameEngine.randomEvents;
    };

    const buttonClasses = (mode: Mode) =>
        `px-4 py-2 rounded-xl font-semibold transition shadow-md w-full text-center 
    ${
        selectedMode === mode
            ? "bg-gradient-to-r from-pink-600/60 to-purple-600/60 text-white scale-102"
            : "border border-pink-700 bg-pink-900/30 text-gray-400 hover:text-white hover:bg-pink-900/60"
    }`;

    return (
        <div>
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <div>
                    <h2 className="text-2xl font-bold text-center text-pink-400 mb-4 drop-shadow-lg">
                        Game Options
                    </h2>

                    <div className="flex flex-col gap-3 mb-2">
                        <button
                            onClick={() => handleChange("versus")}
                            className={buttonClasses("versus")}
                        >
                            Player vs Player
                        </button>

                        <button
                            onClick={() => handleChange("ai_easy")}
                            className={buttonClasses("ai_easy")}
                        >
                            Easy AI
                        </button>

                        <button
                            onClick={() => handleChange("ai_hard")}
                            className={buttonClasses("ai_hard")}
                        >
                            Hard AI
                        </button>

                        <button
                            onClick={() => handleChange("ai_impossible")}
                            className={buttonClasses("ai_impossible")}
                        >
                            Impossible AI
                        </button>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-pink-400 mb-2">
                            Max Score
                        </h3>
                        <input
                            type="number"
                            min="1"
                            max="21"
                            value={maxScore}
                            onChange={(e: any) =>
                                setMaxScore(Number(e.target.value))
                            }
                            className="w-full px-4 py-2 rounded-xl border border-gray-700 bg-gray-800 text-white"
                        />
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-lg font-semibold text-pink-400 mb-2">
                            Random Events
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                checked={gameEngine.randomEvents}
                                type="checkbox"
                                onChange={handleRandomEvent}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:bg-pink-600 transition-all"></div>
                            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-all peer-checked:translate-x-5"></div>
                        </label>
                    </div>

                    <button
                        onClick={() => setModalOpen(false)}
                        className="mt-6 w-full px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500/60 to-purple-500/60 text-white font-semibold hover:scale-105 transition shadow-lg shadow-purple-900/40"
                    >
                        Confirm
                    </button>
                </div>
            </Modal>
        </div>
    );
}
