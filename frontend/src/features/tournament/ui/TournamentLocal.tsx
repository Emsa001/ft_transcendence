import React from "react";
import { GameStatus, GameUserDTOType } from "shared";
import { TournamentRegister } from "./components/TournamentRegister";

import { GameFooter } from "@features/game/ui/components/GameFooter";
import { GameProvider } from "@features/game/model/useGame";

import { GameElementLocal } from "@features/game/ui/components/GameElement";
import {
    LocalTournamentProvider,
    useLocalTournament,
} from "../model/useLocalTournament";
import { LocalTournamentViewer } from "./components/TournamentViewer";

export const TournamentLocal = () => {
    return (
        <div className="w-full h-full">
            <LocalTournamentProvider maxPlayers={16}>
                <div className="w-full h-full">
                    <TournamentView />
                </div>
            </LocalTournamentProvider>
        </div>
    );
};

const TournamentView = () => {
    const { randomEvents, status, currentGame, setCurrentGame, setWinner } =
        useLocalTournament();

    if (status === GameStatus.WAITING) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <TournamentRegister />
            </div>
        );
    }

    if (currentGame) {
        const onScore = (scorer: GameUserDTOType) => {
            console.log("scored", scorer);
        };

        const onSpace = () => {
            if (!currentGame.winner) return true;
            setCurrentGame(null);
            return false;
        };

        const onEnd = (winner: GameUserDTOType) => {
            setWinner(currentGame!.id, winner.username);
        };

        return (
            <div className="w-full h-full">
                <GameProvider
                    players={currentGame.players}
                    onScore={onScore}
                    onEnd={onEnd}
                    onSpace={onSpace}
                    randomEvents={randomEvents}
                >
                    <div className="px-4 py-2" />
                    <GameElementLocal />
                    <GameFooter />
                </GameProvider>
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            <LocalTournamentViewer />
        </div>
    );
};
