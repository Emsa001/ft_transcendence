import React, { useEffect, useState } from "react";
import { useStats } from "../model/useStats";
import { GameDTOType } from "shared";
import { PlayerCard } from "./PlayerCard";

/*
    Test component to display game history.
    usage: <GameHistory userId={1} /> // will fetch and display game history for user with ID 1
*/

export const GameHistory = ({ userId }: { userId: string | number }) => {
    const { fetchGameHistory, loading, error } = useStats();
    const [gameHistory, setGameHistory] = useState<GameDTOType[]>([]);

    useEffect(() => {
        if (!userId) return;
        fetchGameHistory(userId).then((data) => data && setGameHistory(data));
    }, [userId]);

    if (loading) return <div>Loading...</div>;
    if (error)
        return (
            <div>
                <p className="text-red-400 text-center">
                    Failed to load game history. Please try again later.
                </p>
            </div>
        );
    if (!gameHistory.length)
        return (
            <div>
                <p className="text-gray-300 text-center">
                    No games found for this user.
                </p>
            </div>
        );

    return (
        <div className="max-w-2xl mx-auto p-6 rounded-2xl shadow-lg bg-gradient-to-br from-purple-500/30 to-blue-500/30 backdrop-blur-lg border border-white/20">
            <h1 className="text-2xl font-bold text-white mb-6 text-center">
                Game History
            </h1>
            <div className="flex flex-col gap-4  overflow-auto max-h-[500px]">
                {gameHistory.map((game) => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>
        </div>
    );
};

const GameCard = ({ game }: { game: GameDTOType }) => {
    const winner =
        game.players.find((p) => p.id === game.winner)?.name || "No Winner";

    return (
        <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white">
            <GameHeader winner={winner} date={game.createdAt} />
            <div className="grid grid-cols-2 gap-3">
                {game.players.map((player) => (
                    <PlayerCard key={player.id} player={player} />
                ))}
            </div>
        </div>
    );
};

const GameHeader = ({ winner, date }: { winner: string; date: Date }) => (
    <div className="flex justify-between mb-3">
        <span className="font-semibold">
            Winner: <span className="text-green-300">{winner}</span>
        </span>
        <span className="text-sm text-white/70">
            {new Date(date).toLocaleDateString()}
        </span>
    </div>
);
