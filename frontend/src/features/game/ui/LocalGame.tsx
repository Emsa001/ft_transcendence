import React, { useEffect, useState } from "react";
import { GameCanvasElement } from "./GameCanvas";
import { GameHeader } from "./GameHeader";
import { GameFooter } from "./GameFooter";
import { GameBackground } from "./GameBackground";
import { useLocalGame, LocalGameProvider } from "../model/useLocalGame";
import { GameScore } from "./GameScore";
import { useLocalTournament } from "../model/useLocalTournament";
import { TournamentRegisterElement } from "./tournament/TournamentRegister";
import { TournamentViewer } from "./tournament/TournamentViewer";
import { GameStatus } from "shared";

export function LocalGame() {
    const [isTournament, setIsTournament] = useState(false);

    return (
        <div className="select-none min-h-screen w-full flex items-center justify-center p-24">
            <div className="w-full h-full max-h-[80vh] rounded-2xl shadow-2xl bg-white/5 backdrop-blur-xl p-24 relative z-10">
                <LocalGameProvider>
                    <div className="w-full h-full flex items-center justify-center">
                        <GameHeader
                            isTournament={isTournament}
                            setIsTournament={setIsTournament}
                        />
                        <div className="relative w-full max-h-[70vh] aspect-video">
                            {isTournament ? (
                                <TournamentElement />
                            ) : (
                                <GameElement />
                            )}
                        </div>
                    </div>

                    <GameFooter />
                    <GameBackground />
                </LocalGameProvider>
            </div>
        </div>
    );
}

const TournamentElement = () => {
    const {
        status,
        games,
        currentGame,
        playGame,
        createRound,
        startTournament,
        addPlayer,
        removePlayer,
        players,
        deleteTournament,
    } = useLocalTournament();

    if (status === GameStatus.WAITING) {
        return (
            <div>
                <TournamentRegisterElement
                    startTournament={startTournament}
                    players={players}
                    removePlayer={removePlayer}
                    addPlayer={addPlayer}
                />
            </div>
        );
    }

    if (currentGame) {
        return (
            <div>
                <GameElement player1="Player one" player2="Player two" />
            </div>
        );
    }

    if (status === GameStatus.IN_PROGRESS) {
        return (
            <div>
                <TournamentViewer players={players} games={games} />
                <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={createRound}
                >
                    Next Round
                </button>
                <button
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={playGame}
                >
                    Play
                </button>
                <button
                    className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    onClick={deleteTournament}
                >
                    Delete Tournament
                </button>
            </div>
        );
    }

    return <div>Whats going on?</div>;
};

interface GameElementProps {
    player1?: string;
    player2?: string;
    onEnd?: (winner: string) => void;
    onScore?: (scoreL: number, scoreR: number) => void;
}

const GameElement = ({
    player1 = "Player 1",
    player2 = "Player 2",
    onEnd,
    onScore,
}: GameElementProps) => {
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

    // Call external onScore when score changes
    useEffect(() => {
        onScore?.(scoreL, scoreR);
    }, [scoreL, scoreR, onScore]);

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
    }, [messageTimeoutRef, countdownTimeoutRef]);

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
