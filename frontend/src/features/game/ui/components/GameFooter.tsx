import React from "react";
import { useGameState } from "@features/game/model/useGameState";

const symbols: Record<string, string> = {
    arrowup: "↑",
    arrowdown: "↓",
    w: "W",
    s: "S",
    space: "space",
};

export function GameFooter() {
    const { players } = useGameState();

    return (
        <div className="w-full max-w-[800px] flex justify-between items-center px-6 ">
            {/* Player 1 */}
            {players[0] && (
                <div className="flex flex-col items-center gap-2">
                    <p>{players[0].username}:</p>
                    <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-white/10 rounded-md">
                            {symbols[players[0].controls.up.toLowerCase()]}
                        </kbd>
                        <kbd className="px-2 py-1 bg-white/10 rounded-md">
                            {symbols[players[0].controls.down.toLowerCase()]}
                        </kbd>
                    </div>
                </div>
            )}

            {/* Pause */}
            <div className="flex flex-col items-center gap-2">
                <p>Pause:</p>
                <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white/10 rounded-md">
                        {symbols["space"]}
                    </kbd>
                </div>
            </div>

            {/* Player 2 */}
            {players[1] && (
                <div className="flex flex-col items-center gap-2">
                    <p>{players[1].username}:</p>
                    <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-white/10 rounded-md">
                            {symbols[players[1].controls.up.toLowerCase()]}
                        </kbd>
                        <kbd className="px-2 py-1 bg-white/10 rounded-md">
                            {symbols[players[1].controls.down.toLowerCase()]}
                        </kbd>
                    </div>
                </div>
            )}
        </div>
    );
}
