import React from "react";
import { GameWindowState } from "../types";

interface GameHeaderProps {
    window: GameWindowState;
    setWindow: (window: GameWindowState) => void;
}

export function GameHeader({ window, setWindow }: GameHeaderProps) {
    return (
        <div className="absolute z-20 left-4 right-4 top-4 flex items-center justify-between">
            <div className="px-4 py-2 rounded-2xl bg-white/10 shadow-lg">
                <h1 className="text-lg md:text-xl font-semibold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-sky-300">
                    {window.includes("casual") && "Casual Mode"}
                    {window.includes("tournament") && "Tournament Mode"}
                    {window === "menu" && "Menu"}
                </h1>
            </div>
            <button
                onClick={() => setWindow("menu")}
                className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-200 shadow-lg text-sm md:text-base"
            >
                Back to Menu
            </button>
        </div>
    );
}
