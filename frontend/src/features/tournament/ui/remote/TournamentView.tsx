import React from "react";
import { RegisterPlayerList } from "../components/PlayerList";
import { useRemoteTournament } from "@features/tournament/model/useRemoteTournament";
import { GameList } from "../components/GameList";
import { GameRemote } from "@features/game/ui/GameRemote";
import { TournamentInfo } from "./TournamentInfo";

export const TournamentView = () => {
    const {
        player,
        players,
        status,
        start,
        host,
        joinGame,
        currentGame,
        setCurrentGame,
        maxPlayers,
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
        <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-2 p-6">
            {/* Player List */}
            <div className="w-full h-full">
                <RegisterPlayerList players={players} isLocal={false} />
            </div>

            {/* Tournament Info */}
            <div className="w-full h-full">
                <TournamentInfo
                    status={status}
                    host={players.find((p) => p.id === host)?.username}
                    players={players.length}
                    maxPlayers={maxPlayers}
                    onStart={host === player?.id ? start : undefined}
                />
            </div>

            {/* Games */}
            <div className="w-full h-full col-span-2">
                <GameList isLocal={false} onGameClick={joinGame} />
            </div>
        </div>
    );
};
