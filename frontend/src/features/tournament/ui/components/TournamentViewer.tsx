import React from "react";
import { GameList } from "./GameList";
import { RegisterPlayerList, sortPlayersByWins } from "./PlayerList";
import { useLocalTournament } from "../../model/useLocalTournament";
import { TournamentInfo } from "../remote/TournamentInfo";
import { useRemoteTournament } from "@features/tournament/model/useRemoteTournament";
import { GameRemote } from "@features/game/ui/GameRemote";

export const LocalTournamentViewer = () => {
    const {
        players,
        status,
        maxPlayers,
        games,
        startRound,
        playGame,
        deleteTournament,
        randomEvents,
        maxScore,
        winner,
    } = useLocalTournament();

    return (
        <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-2 p-6">
            {/* Player List */}
            <div className="w-full h-full">
                <RegisterPlayerList
                    players={sortPlayersByWins(players, games)}
                />
            </div>

            {/* Tournament Info */}
            <div className="w-full h-full">
                <TournamentInfo
                    status={status}
                    players={players.length}
                    winner={winner}
                    maxPlayers={maxPlayers}
                    onStart={startRound}
                    onDelete={deleteTournament}
                    randomEvents={randomEvents}
                    maxScore={maxScore}
                />
            </div>

            {/* Games */}
            <div className="w-full h-full col-span-2">
                <GameList isLocal={true} onGameClick={playGame} />
            </div>
        </div>
    );
};

export const RemoteTournamentViewer = () => {
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
        games,
        winner,
        maxScore,
        randomEvents,
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
        <div className="max-w-[1600px] w-full h-full grid grid-cols-2 grid-rows-2 gap-2 p-6">
            {/* Player List */}
            <div className="w-full h-full">
                <RegisterPlayerList
                    players={sortPlayersByWins(players, games)}
                    isLocal={false}
                />
            </div>

            {/* Tournament Info */}
            <div className="w-full h-full">
                <TournamentInfo
                    status={status}
                    host={players.find((p) => p.id === host)?.username}
                    players={players.length}
                    maxPlayers={maxPlayers}
                    onStart={host === player?.id ? start : undefined}
                    winner={winner}
                    randomEvents={randomEvents}
                    maxScore={maxScore}
                />
            </div>

            {/* Games */}
            <div className="w-full h-full col-span-2">
                <GameList isLocal={false} onGameClick={joinGame} />
            </div>
        </div>
    );
};
