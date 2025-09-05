import { useLocalTournament } from "@features/tournament/model/useLocalTournament";
import React, { useEffect, useRef } from "react";
import { TournamentUserDTOType } from "shared";

export const TournamentPlayerList = () => {
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

interface RegisteredPlayerListProps {
    players: TournamentUserDTOType[];
    onRemovePlayer?: (username: string) => void;
}

export const RegisterPlayerList = ({
    players,
    onRemovePlayer,
}: RegisteredPlayerListProps) => {
    const listRef = useRef<HTMLUListElement | null>(null);

    useEffect(() => {
        listRef.current?.scrollTo({
            top: listRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [players]);

    return (
        <ul
            className="h-full overflow-y-auto scrollbar-minimal space-y-2 p-3"
            ref={listRef}
        >
            {players.length === 0 && (
                <li className="text-gray-400 text-center">
                    No players registered yet.
                </li>
            )}

            {players.map((p) => (
                <li
                    key={p.username}
                    className="flex justify-between items-center p-2 rounded-xl bg-white/10 backdrop-blur-sm"
                >
                    <span className="text-gray-200">{p.username}</span>
                    {onRemovePlayer && (
                        <button
                            onClick={() => onRemovePlayer(p.username)}
                            className="text-red-400 hover:text-red-300 transition"
                        >
                            ✕
                        </button>
                    )}
                </li>
            ))}
        </ul>
    );
};
