import { GameWindowState } from "@features/game/types";
import { GameBackground } from "@features/game/ui/components/GameBackground";
import { GameHeader } from "@features/game/ui/components/GameHeader";
import { GameLocal } from "@features/game/ui/GameLocal";
import { MenuScreen } from "@features/game/ui/MenuScreen";
import { TournamentElement } from "@features/game/ui/tournament/TournamentElement";
import React, { useState } from "react";

export default function Game() {
    const [window, setWindow] = useState<GameWindowState>("local-tournament");

    if (window === "menu") {
        return (
            <div>
                <MenuScreen setWindow={setWindow} />
            </div>
        );
    }

    return (
        <div className="select-none h-screen w-screen flex items-center justify-center p-12">
            <div className="w-full min-h-[80vh] rounded-2xl shadow-2xl bg-fuchsia-900/5 backdrop-blur-xl flex flex-col">
                {/* Header stays at the top */}
                <GameHeader window={window} setWindow={setWindow} />

                {/* Content fills remaining space and centers vertically */}
                <div className="flex-1 flex items-center justify-center">
                    {window === "local-casual" && <GameLocal />}
                    {window === "local-tournament" && <TournamentElement />}
                </div>

                <GameBackground />
            </div>
        </div>
    );
}
