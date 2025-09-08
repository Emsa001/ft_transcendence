import React from "react";

import GameMenu from "./GameMenu";
import { GameBackground } from "@features/game/ui/components/GameBackground";
import { GameHeader } from "@features/game/ui/components/GameHeader";
import { GameLocal } from "@features/game/ui/GameLocal";
import { GameRemote } from "@features/game/ui/GameRemote";
import { TournamentLocal } from "@features/tournament/ui/TournamentLocal";
import { TournamentRemote } from "@features/tournament/ui/TournamentRemote";

interface GameProps {
    type?: "local" | "remote";
    mode?: "casual" | "tournament";
    code?: string;
}

export default function Game({ type, mode, code }: GameProps) {
    if (!type || !mode) {
        return (
            <div className="p-16 pt-24 h-full">
                <GameMenu />
            </div>
        );
    }

    return (
        <div className="h-full w-full flex items-center justify-center p-16 pt-24">
            <div className="w-full h-full rounded-2xl shadow-2xl bg-fuchsia-900/5 relative pb-24 border border-white/10 overflow-hidden">
                {/* Header stays at the top */}
                <GameHeader type={type} mode={mode} code={code} />

                {type === "local" && mode === "casual" && <GameLocal />}
                {type === "local" && mode === "tournament" && (
                    <TournamentLocal />
                )}

                {type === "remote" && mode === "casual" && (
                    <GameRemote code={code} />
                )}
                {type === "remote" && mode === "tournament" && (
                    <TournamentRemote code={code} />
                )}
                <GameBackground />
            </div>
        </div>
    );
}
