import { GameWindowState } from "@features/game/types";
import { GameBackground } from "@features/game/ui/components/GameBackground";
import { GameHeader } from "@features/game/ui/components/GameHeader";
import { GameLocal } from "@features/game/ui/GameLocal";
import { GameRemote } from "@features/game/ui/GameRemote";
import { MenuScreen } from "@features/game/ui/MenuScreen";
import { TournamentElement } from "@features/game/ui/tournament/TournamentElement";
import React, { useState } from "react";

export default function Game() {
    const [window, setWindow] = useState<GameWindowState>("remote-casual");

    if (window === "menu") {
        return (
            <div className="p-16 pt-24 h-full">
                <MenuScreen setWindow={setWindow} />
            </div>
        );
    }

    return (
        <div className="select-none h-full w-full flex items-center justify-center p-16 pt-24">
            <div className="w-full h-full rounded-2xl shadow-2xl bg-fuchsia-900/5 backdrop-blur-xl">
                {/* Header stays at the top */}
                <GameHeader window={window} setWindow={setWindow} />

                {window === "local-casual" && <GameLocal />}
                {window === "local-tournament" && <TournamentElement />}

                {window === "remote-casual" && <GameRemote />}
                {window === "remote-tournament" && <TournamentElement />}

                <GameBackground />
            </div>
        </div>
    );
}
