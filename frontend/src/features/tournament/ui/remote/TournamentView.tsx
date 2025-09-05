import React from "react";
import { RegisterPlayerList } from "../components/PlayerList";
import { useRemoteTournament } from "@features/tournament/model/useRemoteTournament";
import { GameList } from "../components/GameList";
import { GameRemote } from "@features/game/ui/GameRemote";

export const TournamentView = () => {
    const {
        players,
        start,
        status,
        host,
        error,
        joinGame,
        currentGame,
        setCurrentGame,
    } = useRemoteTournament();

    if (currentGame) {
        const handleEnd = () => {
            setCurrentGame(null);
        };

        return (
            <div className="w-full h-full">
                <GameRemote code={currentGame.code} onEnd={handleEnd} />
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <RegisterPlayerList players={players} />
            <GameList isLocal={false} onGameClick={joinGame} />

            <div>Status: {status}</div>
            <div>Host: {players.find((e) => e.id === host)?.username}</div>
            <div>{error}</div>
            <button onClick={start}>Start</button>
        </div>
    );
};
