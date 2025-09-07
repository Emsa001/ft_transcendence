import { useLanguage } from "@features/language/model/useLanguage";
import { useLocalTournament } from "@features/tournament/model/useLocalTournament";
import { useRemoteTournament } from "@features/tournament/model/useRemoteTournament";
import React from "react";

interface GameListProps {
    isLocal: boolean;
    onGameClick?: (code: string) => void;
}

export const GameList = ({ isLocal, onGameClick }: GameListProps) => {
    let games = isLocal
        ? useLocalTournament().games
        : useRemoteTournament().games;

    const { getText } = useLanguage();
    const text = getText("tournament");

    return (
        <section className="overflow-y-auto w-full col-span-2 h-full bg-white/10 p-4 rounded-2xl flex flex-col">
            <h3 className="text-xl font-bold text-gray-200 mb-2 text-center">
                {text.games}
            </h3>

            {games.length === 0 && (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                    {text.startToCreateGames}
                </div>
            )}

            <ul className="overflow-y-auto scrollbar-minimal space-y-2 p-3">
                {games.map((g) => (
                    <li
                        key={g.id}
                        className="p-3 rounded-xl bg-white/10 backdrop-blur-sm flex flex-col gap-1 cursor-pointer hover:bg-white/20 transition"
                        onClick={() => onGameClick?.(g.code)}
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-200">
                                {text.game} #{g.code} -{" "}
                                {g.status.replace("_", " ")} {g.round}
                            </span>
                            {g.winner && (
                                <span className="text-green-400 font-medium text-sm">
                                    {text.winner}:{" "}
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
