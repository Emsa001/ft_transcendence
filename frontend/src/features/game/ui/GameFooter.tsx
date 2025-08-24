import React from "react";

export function GameFooter() {
    return (
        <div className="absolute z-20 left-4 right-4 bottom-4 flex flex-wrap items-center justify-between gap-2">
            <div className="px-3 py-2 rounded-xl bg-white/8 border border-white/10 text-sm text-white/80">
                Left:{" "}
                <kbd className="px-2 py-1 bg-white/10 rounded-md mx-1">W</kbd>
                <kbd className="px-2 py-1 bg-white/10 rounded-md">S</kbd>
                <span className="mx-2">•</span>
                Right:{" "}
                <kbd className="px-2 py-1 bg-white/10 rounded-md mx-1">↑</kbd>
                <kbd className="px-2 py-1 bg-white/10 rounded-md">↓</kbd>
                <span className="mx-2">•</span>
                Pause:{" "}
                <kbd className="px-2 py-1 bg-white/10 rounded-md">Space</kbd>
            </div>
            <div className="px-3 py-2 rounded-xl bg-white/8 border border-white/10 text-sm text-white/70">
                Ball gets faster with each hit!
            </div>
        </div>
    );
}
