import React, { useEffect, useState } from "react";
import { GameCanvasElement } from "./GameCanvas";
import { GameHeader } from "./GameHeader";
import { GameFooter } from "./GameFooter";
import { GameBackground } from "./GameBackground";
import { useLocalGame } from "../model/useLocalGame";
import { GameScore } from "./GameScore";

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
                    {isTournament ? (
                        <div className="text-center text-white">
                            <h2 className="text-3xl font-bold mb-4">
                                Tournament Mode Coming Soon!
                            </h2>
                            <p className="text-lg">
                                Stay tuned for exciting multiplayer features.
                            </p>
                        </div>
                    ) : (
                        <GameElement />
                    )}
                </div>

                <GameFooter />
                <GameBackground />
            </div>
        </div>
    );
}

const GameElement = () => {
    const {
        messageTimeoutRef,
        countdownTimeoutRef,
        isStarted,
        scoreL,
        scoreR,
        paused,
        showMessage,
        countdown,
        keys,
        handleScore,
        gameState: { paddleL, paddleR, ball },
    } = useLocalGame();

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            if (messageTimeoutRef.current) {
                clearTimeout(messageTimeoutRef.current);
            }
            if (countdownTimeoutRef.current) {
                clearTimeout(countdownTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="relative aspect-video w-full max-h-[60vh]">
            <GameCanvasElement
                paused={paused}
                started={isStarted}
                keys={keys}
                paddleL={paddleL}
                paddleR={paddleR}
                ball={ball}
                onScore={handleScore}
                showMessage={showMessage}
                countdown={countdown}
            />
            <GameScore scoreL={scoreL} scoreR={scoreR} />
        </div>
    );
};
