import React, { useState } from "react";
import { GameHeader } from "./GameHeader";
import { GameFooter } from "./GameFooter";
import { GameBackground } from "./GameBackground";
import { GameElement } from "./GameElement";
import { TournamentElement } from "./tournament/TournamentElement";

export function LocalGame() {
    const [isTournament, setIsTournament] = useState(false);

    return (
        <div className="select-none min-h-screen w-full flex items-center justify-center p-24">
            <div className="w-full h-full max-h-[80vh] rounded-2xl shadow-2xl bg-white/5 backdrop-blur-xl p-24 relative z-10">
                <div className="w-full h-full flex items-center justify-center">
                    <GameHeader
                        isTournament={isTournament}
                        setIsTournament={setIsTournament}
                    />
                    <div className="relative w-full max-h-[70vh] aspect-video">
                        {isTournament ? <TournamentElement /> : <GameElement />}
                    </div>
                </div>

                <GameFooter />
                <GameBackground />
            </div>
        </div>
    );
}
