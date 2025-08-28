import { BallField } from "@features/balls/ui/BallField";
import React from "react";
import { GameWindowState } from "../types";

interface MenuScreenProps {
    setWindow: (w: GameWindowState) => void;
}

export const MenuScreen = ({ setWindow }: MenuScreenProps) => {
    const baseButtonClasses =
        "group relative flex items-center justify-center w-64 aspect-square rounded-2xl " +
        "bg-purple-500/10 backdrop-blur-xl shadow-2xl " +
        "text-2xl font-bold text-white " +
        "transition-all duration-500 hover:scale-110";

    const overlayBaseClasses =
        "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 " +
        "transition-opacity duration-500 blur-xl";

    const buttons = [
        {
            label: "Play Local Casual",
            window: "local-casual",
            overlay: "bg-gradient-to-tr from-purple-500/40 to-blue-500/40",
            rotate: "hover:rotate-3",
        },
        {
            label: "Play Local Tournament",
            window: "local-tournament",
            overlay: "bg-gradient-to-tr from-pink-500/40 to-orange-500/40",
            rotate: "hover:-rotate-3",
        },
        {
            label: "Play Remote",
            window: "remote-casual",
            overlay: "bg-gradient-to-tr from-indigo-500/40 to-blue-500/40",
            rotate: "hover:-rotate-3",
        },
        {
            label: "Play Remote Tournament",
            window: "remote-tournament",
            overlay: "bg-gradient-to-tr from-fuchsia-500/40 to-pink-500/40",
            rotate: "hover:rotate-3",
        },
    ];

    return (
        <section className="w-screen h-screen">
            <div className="relative flex flex-col items-center justify-center h-full px-4 text-center gap-16">
                {/* Game Mode Buttons as Grid */}
                <div className="grid grid-cols-2 gap-12 relative z-10">
                    {buttons.map(({ label, window, overlay, rotate }) => (
                        <button
                            key={window}
                            onClick={() => setWindow(window as GameWindowState)}
                            className={`${baseButtonClasses} ${rotate}`}
                        >
                            <span className="relative z-10">{label}</span>
                            <div
                                className={`${overlayBaseClasses} ${overlay}`}
                            />
                        </button>
                    ))}
                </div>
            </div>
            <BallField />
        </section>
    );
};
