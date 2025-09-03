import React from "react";
import { useGame } from "@features/game/model/useGame";
import { gameEngine } from "@features/game/service/GameEngine";

const symbols: Record<string, string> = {
    arrowup: "↑",
    arrowdown: "↓",
    w: "W",
    s: "S",
    space: "space",
};

export function GameFooter() {
    const { players } = useGame();
    const paddles = gameEngine.paddles;

    return (
        <div className="w-full max-w-[800px] flex justify-between items-center px-6">
            {/* Player 1 */}

            <div>
                {players[0] && paddles[0] && (
                    <div className="flex flex-col items-center gap-2">
                        <p>{players[0].username}:</p>
                        <div className="flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-white/10 rounded-md">
                                {symbols[paddles[0].controls.up.toLowerCase()]}
                            </kbd>
                            <kbd className="px-2 py-1 bg-white/10 rounded-md">
                                {
                                    symbols[
                                        paddles[0].controls.down.toLowerCase()
                                    ]
                                }
                            </kbd>
                        </div>
                    </div>
                )}
            </div>

            {/* Pause */}
            <div className="flex flex-col items-center gap-2">
                <p>Pause:</p>
                <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white/10 rounded-md">
                        {symbols["space"]}
                    </kbd>
                </div>
            </div>

            <div>
                {/* Player 2 */}
                {players[1] && paddles[1] && (
                    <div className="flex flex-col items-center gap-2">
                        <p>{players[1].username}:</p>
                        <div className="flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-white/10 rounded-md">
                                {symbols[paddles[1].controls.up.toLowerCase()]}
                            </kbd>
                            <kbd className="px-2 py-1 bg-white/10 rounded-md">
                                {
                                    symbols[
                                        paddles[1].controls.down.toLowerCase()
                                    ]
                                }
                            </kbd>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
