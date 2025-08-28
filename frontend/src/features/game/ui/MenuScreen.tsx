import { BallField } from "@features/balls/ui/BallField";
import React from "react";

interface MenuScreenProps {
    setWindow: (w: "casual" | "tournament") => void;
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

    return (
        <section className="w-screen h-screen">
            <div className="relative flex flex-col items-center justify-center h-full px-4 text-center gap-16">
                {/* Game Mode Buttons as Grid */}
                <div className="grid grid-cols-2 gap-12 relative z-10">
                    <button
                        onClick={() => setWindow("casual")}
                        className={`${baseButtonClasses} hover:rotate-3`}
                    >
                        <span className="relative z-10">Play Local Casual</span>
                        <div
                            className={`${overlayBaseClasses} bg-gradient-to-tr from-purple-500/40 to-blue-500/40`}
                        />
                    </button>

                    <button
                        onClick={() => setWindow("tournament")}
                        className={`${baseButtonClasses} hover:-rotate-3`}
                    >
                        <span className="relative z-10">
                            Play Local Tournament
                        </span>
                        <div
                            className={`${overlayBaseClasses} bg-gradient-to-tr from-pink-500/40 to-orange-500/40`}
                        />
                    </button>

                    <button
                        onClick={() => setWindow("casual")}
                        className={`${baseButtonClasses} hover:rotate-3`}
                    >
                        <span className="relative z-10">Play Remote</span>
                        <div
                            className={`${overlayBaseClasses} bg-gradient-to-tr from-indigo-500/40 to-blue-500/40`}
                        />
                    </button>

                    <button
                        onClick={() => setWindow("tournament")}
                        className={`${baseButtonClasses} hover:-rotate-3`}
                    >
                        <span className="relative z-10">
                            Play Remote Tournament
                        </span>
                        <div
                            className={`${overlayBaseClasses} bg-gradient-to-tr from-fuchsia-500/40 to-orange-500/40`}
                        />
                    </button>
                </div>
            </div>
            <BallField />
        </section>
    );
};
