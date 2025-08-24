import { LocalGame } from "@features/game/ui/LocalGame";
import React from "react";

interface GameProps {
    type?: "local" | "remote";
}

export default function Game({ type }: GameProps) {
    return (
        <div className="flex items-center justify-center h-full text-white">
            {type === "local" ? (
                <LocalGame />
            ) : (
                <div>
                    <h1 className="text-2xl font-bold">
                        Remote Game Mode Coming Soon!
                    </h1>
                    <p className="mt-4">Stay tuned for multiplayer features.</p>
                </div>
            )}
        </div>
    );
}
