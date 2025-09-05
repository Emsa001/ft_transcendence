import React from "react";
import { ShinyText } from "@shared/components/Shiny";
import { GameList } from "./GameList";
import { RegisterPlayerList, TournamentPlayerList } from "./PlayerList";
import { useLocalTournament } from "../../model/useLocalTournament";
import { TournamentInfo } from "../remote/TournamentInfo";

export const TournamentViewer = () => {
    const {
        players,
        status,
        maxPlayers,
        startRound,
        playGame,
        deleteTournament,
        games,
    } = useLocalTournament();

    return (
        <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-2 p-6">
            {/* Player List */}
            <div className="w-full h-full">
                <RegisterPlayerList players={players} />
            </div>

            {/* Tournament Info */}
            <div className="w-full h-full">
                <TournamentInfo
                    status={status}
                    players={players.length}
                    maxPlayers={maxPlayers}
                    onStart={startRound}
                    onDelete={deleteTournament}
                />
            </div>

            {/* Games */}
            <div className="w-full h-full col-span-2">
                <GameList isLocal={true} onGameClick={playGame} />
            </div>
        </div>
    );

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            {/* Title */}
            <ShinyText
                text="Tournament Viewer"
                gradient="bg-logo-gradient"
                className="text-5xl font-extrabold text-center mb-6"
            />

            {/* Main content area */}
            <div className="relative w-full max-h-[50vh] max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 flex-1 overflow-hidden">
                <TournamentPlayerList />
                <GameList isLocal={true} />
            </div>

            {/* Buttons area pinned at bottom */}
            <div className="flex gap-4 flex-wrap justify-center p-4 shrink-0">
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={startRound}
                >
                    Next Round
                </button>
                <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={playGame}
                >
                    Play
                </button>
                <button
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    onClick={deleteTournament}
                >
                    Delete Tournament
                </button>
            </div>
        </div>
    );
};
