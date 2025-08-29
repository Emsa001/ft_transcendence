import React from "react";
import { TournamentRegisterElement } from "./TournamentRegister";
import { useLocalTournament } from "@features/game/model/useLocalTournament";
import { GameStatus } from "shared";
import { TournamentViewer } from "./TournamentViewer";
import { GameElement } from "../GameElement";
import { PongPlayer } from "@features/game/types";
import { GameStateProvider } from "@features/game/model/useGameState";

export const TournamentElement = () => {
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
        setWinner,
        setCurrentGame,
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
        const onScore = (scorer: PongPlayer) => {
            console.log("scored", scorer);
        };

        const onSpace = () => {
            if (!currentGame.winner) return true;
            setCurrentGame(null);
            return false;
        };

        const onEnd = (winner: PongPlayer) => {
            console.log("game ended, winner:", winner);
            setWinner(currentGame!.id, winner.username);
        };

        return (
            <div className="w-full h-full">
                <GameStateProvider
                    playersConfig={currentGame.players}
                    maxScore={1}
                >
                    <div className="w-full h-full flex items-center justify-center gap-6">
                        <GameElement
                            onScore={onScore}
                            onEnd={onEnd}
                            onSpace={onSpace}
                        />
                    </div>
                </GameStateProvider>
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
