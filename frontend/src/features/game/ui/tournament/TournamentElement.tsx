import React from "react";
import { TournamentRegister } from "./TournamentRegister";
import { GameStatus } from "shared";
import { TournamentViewer } from "./TournamentViewer";
import { PongPlayer } from "@features/game/types";
import { GameStateProvider } from "@features/game/model/useGameState";
import { GameElement } from "../components/GameElement";
import { GameFooter } from "../components/GameFooter";
import {
    LocalTournamentProvider,
    useLocalTournament,
} from "@features/game/model/LocalTournamentProvider";

export const TournamentElement = () => {
    return (
        <div className="w-full h-full">
            <LocalTournamentProvider maxPlayers={1000}>
                <div>
                    <TournamentView />
                </div>
            </LocalTournamentProvider>
        </div>
    );
};

const TournamentView = () => {
    const { status, currentGame, setCurrentGame, setWinner } =
        useLocalTournament();

    if (status === GameStatus.WAITING) {
        return (
            <div className="w-full h-full flex items-center justify-center p-4">
                <TournamentRegister />
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
            <div className="w-full h-full flex items-center justify-center gap-6 px-2">
                <GameStateProvider
                    playersConfig={currentGame.players}
                    maxScore={1}
                    onScore={onScore}
                    onEnd={onEnd}
                    onSpace={onSpace}
                >
                    <div className="flex flex-col items-center gap-6 px-2">
                        {/* GameElement takes all remaining space */}
                        <GameElement />

                        {/* Footer stays at bottom */}
                        <GameFooter />
                    </div>
                </GameStateProvider>
            </div>
        );
    }

    if (status === GameStatus.IN_PROGRESS) {
        return (
            <div className="w-full h-full p-8">
                <TournamentViewer />
            </div>
        );
    }

    return <div>Whats going on?</div>;
};
