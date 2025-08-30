import React from "react";
import { BallField } from "@features/balls/ui/BallField";
import { ShinyText } from "@shared/components/Shiny";
import { GameWindowState } from "../types";

interface MenuScreenProps {
    setWindow: (w: GameWindowState) => void;
}

export const MenuScreen = ({ setWindow }: MenuScreenProps) => {
    const baseButtonClasses =
        "group relative flex items-center justify-center " +
        "aspect-square min-w-[6rem] max-w-[16rem] rounded-2xl " +
        "bg-purple-500/10 backdrop-blur-xl shadow-2xl " +
        "text-[clamp(0.8rem,3vw,1.5rem)] font-bold text-white " +
        "transition-all duration-500 hover:scale-110";

    const overlayBaseClasses =
        "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 " +
        "transition-opacity duration-500 blur-xl";

    const buttons = [
        {
            label: "Local Casual",
            window: "local-casual",
            overlay: "bg-gradient-to-tr from-purple-500/40 to-blue-500/40",
            rotate: "hover:rotate-3",
        },
        {
            label: "Local Tournament",
            window: "local-tournament",
            overlay: "bg-gradient-to-tr from-pink-500/40 to-orange-500/40",
            rotate: "hover:-rotate-3",
        },
        {
            label: "Remote",
            window: "remote-casual",
            overlay: "bg-gradient-to-tr from-indigo-500/40 to-blue-500/40",
            rotate: "hover:-rotate-3",
        },
        {
            label: "Remote Tournament",
            window: "remote-tournament",
            overlay: "bg-gradient-to-tr from-fuchsia-500/40 to-pink-500/40",
            rotate: "hover:rotate-3",
        },
    ];

    return (
        <section className="w-full h-full text-center flex flex-col items-center justify-center">
            <ShinyText
                text="Game Selector"
                gradient="bg-logo-gradient"
                className="text-[clamp(3rem,6vw,10rem)] font-extrabold select-none text-white drop-shadow-xl"
            />
            {/* Game Mode Buttons as Grid */}
            <div className="grid grid-cols-2 gap-6 md:gap-12 z-10 mt-8">
                {buttons.map(({ label, window, overlay, rotate }) => (
                    <button
                        key={window}
                        onClick={() => setWindow(window as GameWindowState)}
                        className={`${baseButtonClasses} ${rotate}`}
                    >
                        <span className="relative z-10 px-12">{label}</span>
                        <div className={`${overlayBaseClasses} ${overlay}`} />
                    </button>
                ))}
            </div>
            <BallField />
        </section>
    );
};
