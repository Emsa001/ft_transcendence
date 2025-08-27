import React from "react";
import { GameDTOType, TournamentUserDTOType, GameStatus } from "shared";

interface TournamentViewerProps {
    players: TournamentUserDTOType[];
    games: GameDTOType[];
}

export const TournamentViewer = ({ players, games }: TournamentViewerProps) => {
    return (
        <div className="w-full overflow-x-auto py-4 text-white">
            <h2 className="text-xl font-bold mb-2">Players</h2>
            <ul className="space-y-1 mb-4">
                {players.map((p) => (
                    <li
                        key={p.id}
                        className={`px-3 py-2 rounded-lg ${
                            p.eliminated ? "bg-red-500/30" : "bg-green-500/30"
                        }`}
                    >
                        {p.username} {p.eliminated && "(eliminated)"}
                    </li>
                ))}
            </ul>

            <h2 className="text-xl font-bold mb-2">Games</h2>
            <ul className="space-y-2">
                {games.map((g) => (
                    <li
                        key={g.id}
                        className="px-3 py-2 rounded-lg bg-gray-700/40"
                    >
                        <p className="font-semibold">
                            Game #{g.id} – {g.status.replace("_", " ")}
                        </p>
                        <p className="text-sm">
                            {g.players.map((pl) => pl.username).join(" vs ")}
                        </p>
                        {g.winner && (
                            <p className="text-sm text-green-400">
                                Winner:{" "}
                                {
                                    g.players.find((pl) => pl.id === g.winner)
                                        ?.username
                                }
                            </p>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};
