import React from "react";

interface GameHeaderProps {
    isTournament: boolean;
    setIsTournament: (value: boolean) => void;
}

export function GameHeader({ isTournament, setIsTournament }: GameHeaderProps) {
    return (
        <div className="absolute z-20 left-4 right-4 top-4 flex items-center justify-between">
            <div className="px-4 py-2 rounded-2xl bg-white/10 shadow-lg">
                <h1 className="text-lg md:text-xl font-semibold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-sky-300">
                    {isTournament ? "Tournament" : "Local Game"}
                </h1>
            </div>

            <div className="flex gap-2">
                {isTournament ? (
                    <button
                        onClick={() => setIsTournament(false)}
                        className="px-4 py-2 rounded-2xl bg-red-500/20 shadow-lg hover:bg-red-500/30"
                    >
                        Exit Tournament
                    </button>
                ) : (
                    <button
                        onClick={() => setIsTournament(true)}
                        className="px-4 py-2 rounded-2xl bg-green-500/20 shadow-lg hover:bg-green-500/30"
                    >
                        Play Tournament
                    </button>
                )}
            </div>
        </div>
    );
}
