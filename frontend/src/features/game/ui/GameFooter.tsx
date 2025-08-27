import React from "react";
import { PongPlayer } from "../types";

interface GameFooterProps {
    players?: PongPlayer[];
}

export function GameFooter({ players }: GameFooterProps) {
    // Default controls if no players provided
    const defaultControls = [
        { name: "Player 1", up: "W", down: "S" },
        { name: "Player 2", up: "↑", down: "↓" },
    ];

    const displayControls = players
        ? players.map((player) => ({
              name: player.name,
              up: player.controls.up.toUpperCase(),
              down: player.controls.down.toUpperCase(),
          }))
        : defaultControls;

    return (
        <div className="absolute z-20 left-4 right-4 bottom-4 flex flex-wrap items-center justify-between gap-2">
            <div className="px-3 py-2 rounded-xl bg-white/8 border border-white/10 text-sm text-white/80 flex flex-wrap gap-4">
                {displayControls.map((control, index) => (
                    <div key={index} className="flex items-center">
                        {control.name}:{" "}
                        <kbd className="px-2 py-1 bg-white/10 rounded-md mx-1">
                            {control.up}
                        </kbd>
                        <kbd className="px-2 py-1 bg-white/10 rounded-md">
                            {control.down}
                        </kbd>
                        {index < displayControls.length - 1 && (
                            <span className="mx-2">•</span>
                        )}
                    </div>
                ))}
                <div className="flex items-center">
                    <span className="mx-2">•</span>
                    Pause:{" "}
                    <kbd className="px-2 py-1 bg-white/10 rounded-md">
                        Space
                    </kbd>
                </div>
            </div>
        </div>
    );
}
