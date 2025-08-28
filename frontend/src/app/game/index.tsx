import { WindowState } from "@features/game/types";
import { GameBackground } from "@features/game/ui/GameBackground";
import { GameElement } from "@features/game/ui/GameElement";
import { GameHeader } from "@features/game/ui/GameHeader";
import { MenuScreen } from "@features/game/ui/MenuScreen";
import { TournamentElement } from "@features/game/ui/tournament/TournamentElement";
import React, { useState } from "react";

export default function Game() {
    const [window, setWindow] = useState<WindowState>("menu");

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
                {window === "casual" && <GameElement />}
                {window === "tournament" && <TournamentElement />}
                <GameBackground />
            </div>
        </div>
    );
}
