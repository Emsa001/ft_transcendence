import React from "react";
import { ShinyText } from "@shared/components/Shiny";
import { useLocalTournament } from "../model/LocalTournamentProvider";

// TODO: Make game list better, show some message when finished

export const TournamentViewer = () => {
    const { createRound, playGame, deleteTournament } = useLocalTournament();

    return (
        <div className="flex flex-col items-center h-full w-full overflow-hidden py-12">
            {/* Title */}
            <ShinyText
                text="Tournament Viewer"
                gradient="bg-logo-gradient"
                className="text-5xl font-extrabold text-center mb-6"
            />

            {/* Main content area */}
            <div className="relative w-full max-h-[50vh] max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 flex-1 overflow-hidden">
                <PlayerList />
                <GameBrackets />
            </div>

            {/* Buttons area pinned at bottom */}
            <div className="flex gap-4 flex-wrap justify-center p-4 shrink-0">
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={createRound}
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

const PlayerList = () => {
    const { players, games } = useLocalTournament();

    const getWins = (playerUsername: string) => {
        return games.filter((game) => game.winner === playerUsername).length;
    };

    const playerWins = players
        .map((player) => ({
            ...player,
            wins: getWins(player.username),
        }))
        .sort((a, b) => {
            if (a.eliminated === b.eliminated) {
                return b.wins - a.wins;
            }
            return a.eliminated ? 1 : -1;
        });

    return (
        <section className="overflow-y-auto w-full h-full bg-white/10 p-4 rounded-2xl flex flex-col">
            <h3 className="text-xl font-bold text-gray-200 mb-2 text-center">
                Players
            </h3>
            <ul className="overflow-y-auto scrollbar-minimal space-y-2 p-3">
                {players.length === 0 && (
                    <li className="text-gray-400 text-center">
                        No players registered yet.
                    </li>
                )}
                {playerWins.map((p) => {
                    return (
                        <li
                            key={p.username}
                            className={`flex justify-between items-center p-2 rounded-xl bg-white/10 backdrop-blur-sm transition`}
                        >
                            <span className="text-gray-200">{p.username}</span>
                            <span className="text-gray-300 text-sm">
                                Wins: {p.wins}
                            </span>
                            <span
                                className={`text-sm font-medium px-2 py-1 rounded-full ${
                                    p.eliminated
                                        ? "bg-red-500/30 text-red-300"
                                        : "bg-green-500/30 text-green-200"
                                }`}
                            >
                                {p.eliminated ? "Eliminated" : "Active"}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
};

const GameBrackets = () => {
    const { games } = useLocalTournament();

    return (
        <section className="overflow-y-auto w-full col-span-2 h-full bg-white/10 p-4 rounded-2xl flex flex-col">
            <h3 className="text-xl font-bold text-gray-200 mb-2 text-center">
                Games
            </h3>

            {games.length === 0 && (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No games played yet.
                </div>
            )}

            <ul className="overflow-y-auto scrollbar-minimal space-y-2 p-3">
                {games.map((g) => (
                    <li
                        key={g.id}
                        className="p-3 rounded-xl bg-white/10 backdrop-blur-sm flex flex-col gap-1"
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-200">
                                Game #{g.id} - {g.status.replace("_", " ")}{" "}
                                {g.round}
                            </span>
                            {g.winner && (
                                <span className="text-green-400 font-medium text-sm">
                                    Winner:{" "}
                                    {
                                        g.players.find(
                                            (pl) => pl.username === g.winner
                                        )?.username
                                    }
                                </span>
                            )}
                        </div>
                        <span className="text-gray-300 text-sm">
                            {g.players.map((pl) => pl.username).join(" vs ")}
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    );
};
