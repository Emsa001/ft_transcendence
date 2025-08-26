import React from "react";
import { useLocalGame } from "../model/useLocalGame";

interface GameHeaderProps {
    isTournament: boolean;
    setIsTournament: (value: boolean) => void;
}

export function GameHeader({ isTournament, setIsTournament }: GameHeaderProps) {
    const { isStarted, paused, startGame, handlePause, handleReset } =
        useLocalGame();

    return (
        <div className="absolute z-20 left-4 right-4 top-4 flex items-center justify-between">
            <div className="px-4 py-2 rounded-2xl bg-white/10 shadow-lg">
                <h1 className="text-lg md:text-xl font-semibold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-sky-300">
                    {isTournament ? "Tournament" : "Local Game"}
                </h1>
            </div>

            <div className="flex gap-2">
                {isTournament ? (
                    // Tournament mode → only show Exit Tournament
                    <button
                        onClick={() => setIsTournament(false)}
                        className="px-4 py-2 rounded-2xl bg-red-500/20 shadow-lg hover:bg-red-500/30"
                    >
                        Exit Tournament
                    </button>
                ) : isStarted ? (
                    // Game started → Pause / Resume + Exit Game
                    <>
                        <button
                            onClick={handlePause}
                            className="px-4 py-2 rounded-2xl bg-white/10 shadow-lg hover:bg-white/15"
                        >
                            {paused ? "Resume" : "Pause"}
                        </button>
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 rounded-2xl bg-red-500/20 shadow-lg hover:bg-red-500/30"
                        >
                            Exit Game
                        </button>
                    </>
                ) : (
                    // No game started → Start Game + Start Tournament
                    <>
                        <button
                            onClick={startGame}
                            className="px-4 py-2 rounded-2xl bg-green-500/20 shadow-lg hover:bg-green-500/30"
                        >
                            Start Game
                        </button>
                        <button
                            onClick={() => setIsTournament(true)}
                            className="px-4 py-2 rounded-2xl bg-green-500/20 shadow-lg hover:bg-green-500/30"
                        >
                            Start Tournament
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
