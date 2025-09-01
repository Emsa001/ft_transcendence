import React from "react";
import { TournamentRegister } from "./TournamentRegister";
import { GameStatus } from "shared";
import { TournamentViewer } from "./TournamentViewer";
import { PongPlayer } from "@features/game/types";
import { GameElement } from "../components/GameElement";
import { GameFooter } from "../components/GameFooter";
import {
    LocalTournamentProvider,
    useLocalTournament,
} from "@features/game/context/LocalTournamentProvider";
import { GameStateProvider } from "@features/game/context/useGameState";

export const TournamentElement = () => {
    return (
        <div className="w-full h-full">
            <LocalTournamentProvider maxPlayers={1000}>
                <div className="w-full h-full">
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
            <div className="w-full h-full flex items-center justify-center">
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
            <div className="w-full h-full">
                <GameStateProvider
                    playersConfig={currentGame.players}
                    maxScore={1}
                    onScore={onScore}
                    onEnd={onEnd}
                    onSpace={onSpace}
                >
                    <GameElement />
                    <GameFooter />
                </GameStateProvider>
            </div>
        );
    }

    if (status === GameStatus.IN_PROGRESS) {
        return (
            <div className="w-full h-full">
                <TournamentViewer />
            </div>
        );
    }

    return <div>Whats going on?</div>;
};
