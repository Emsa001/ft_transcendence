import React, { useState } from "react";
import Swal from "sweetalert2";
import { useGame } from "@features/game/model/useGame";
import { OptionsModal } from "./GameOptions";
import { useLanguage } from "@features/language/model/useLanguage";

const defaultButton =
    "px-4 py-2 rounded-xl transition text-white font-bold shadow";

const GameActions = () => {
    const { state, startGame, stopGame } = useGame();
    const { getText } = useLanguage();
    const text = getText("options");

    if (state == "started" || state == "paused") {
        return (
            <button
                className={`${defaultButton} hover:bg-red-600/30 bg-red-600/20`}
                onClick={stopGame}
            >
                {text.endGame}
            </button>
        );
    }

    return (
        <button
            className={`${defaultButton} hover:bg-purple-500/30 bg-purple-500/20`}
            onClick={startGame}
        >
            {text.startGame}
        </button>
    );
};

export function Options() {
    const [isOpen, setIsOpen] = useState(false);
    const { state } = useGame();
    const { getText } = useLanguage();
    const text = getText("options");
    const isRunning = state != "created" && state != "finished";

    const handleOpen = () => {
        if (state !== "created") return;
        setIsOpen(true);
    };

    return (
        <div>
            <button
                onClick={handleOpen}
                className={`bg-white/10 px-4 py-2 rounded-xl transition text-white font-bold shadow ${isRunning ? "opacity-50" : "hover:bg-white/15"}`}
            >
                {text.options}
            </button>
            <OptionsModal modalOpen={isOpen} setModalOpen={setIsOpen} />
        </div>
    );
}

export const GameSettings = () => {
    return (
        <div className="flex gap-4 items-center justify-center">
            <GameActions />
            <Options />
        </div>
    );
};
