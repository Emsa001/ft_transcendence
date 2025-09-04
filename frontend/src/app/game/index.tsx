import React from "react";

import GameMenu from "./GameMenu";
import { GameBackground } from "@features/game/ui/components/GameBackground";
import { GameHeader } from "@features/game/ui/components/GameHeader";
import { GameLocal } from "@features/game/ui/GameLocal";
import { GameRemoteElement } from "@features/game/ui/GameRemote";
import { TournamentElement } from "@features/tournament/ui/TournamentElement";

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
        <div className="select-none h-full w-full flex items-center justify-center p-16 pt-24">
            <div className="w-full h-full rounded-2xl shadow-2xl bg-fuchsia-900/5 relative">
                {/* Header stays at the top */}
                <GameHeader type={type} mode={mode} code={code} />

                {type === "local" && mode === "casual" && <GameLocal />}
                {type === "local" && mode === "tournament" && (
                    <TournamentElement />
                )}

                {type === "remote" && mode === "casual" && (
                    <GameRemoteElement code={code} />
                )}
                {type === "remote" && mode === "tournament" && (
                    <TournamentElement code={code} />
                )}

                <GameBackground />
            </div>
        </div>
    );
}
