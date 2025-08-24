import React from "react";

interface GameHeaderProps {
    onPlay: () => void;
    onPause: () => void;
    onReset: () => void;
    paused: boolean;
}

export function GameHeader({
    onPlay,
    onPause,
    onReset,
    paused,
}: GameHeaderProps) {
    return (
        <div className="absolute z-20 left-4 right-4 top-4 flex items-center justify-between">
            <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 shadow-lg">
                <h1 className="text-lg md:text-xl font-semibold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-sky-300">
                    Glass Pong — 2P
                </h1>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={onPlay}
                    className="px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-500/60 to-fuchsia-500/60 border border-white/20 shadow-lg hover:from-indigo-500 hover:to-fuchsia-500 transition-colors"
                >
                    Play
                </button>
                <button
                    onClick={onPause}
                    className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 shadow-lg hover:bg-white/15"
                >
                    {paused ? "Resume" : "Pause"}
                </button>
                <button
                    onClick={onReset}
                    className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 shadow-lg hover:bg-white/15"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}
