import { GameWindowState } from "@features/game/types";
import { GameBackground } from "@features/game/ui/components/GameBackground";
import { GameHeader } from "@features/game/ui/components/GameHeader";
import { GameLocal } from "@features/game/ui/GameLocal";
import { MenuScreen } from "@features/game/ui/MenuScreen";
import { TournamentElement } from "@features/game/ui/tournament/TournamentElement";
import React, { useState } from "react";

export default function Game() {
    const [window, setWindow] = useState<GameWindowState>("local-casual");

    if (window === "menu") {
        return (
            <div>
                <MenuScreen setWindow={setWindow} />
            </div>
        );
    }

    return (
        <div className="select-none h-screen w-screen flex items-center justify-center p-12">
            <div className="w-full min-h-[60vh] max-h-[80vh] rounded-2xl shadow-2xl bg-white/5 backdrop-blur-xl p-24 relative z-10 flex flex-col items-center justify-center">
                <GameHeader window={window} setWindow={setWindow} />
                {window === "local-casual" && <GameLocal />}
                {window === "local-tournament" && <TournamentElement />}
                <GameBackground />
            </div>
        </div>
    );
}
