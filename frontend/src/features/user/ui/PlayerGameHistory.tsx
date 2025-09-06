import React, { useEffect, useState } from "react";
import { useStats } from "../model/useStats";
import { GameDTOType } from "shared";
import { PlayerCard } from "./PlayerCard";
import { useLanguage } from "@features/language/model/useLanguage";

/*
    Test component to display game history.
    usage: <GameHistory userId={1} /> // will fetch and display game history for user with ID 1
*/


export const PlayerGameHistory = ({ userId }: { userId: string | number }) => {
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
                <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2 text-gray-100">
                    Game History
                </h2>
                <p className="h-124 text-gray-300 text-center">
                    No games found for this user.
                </p>
            </div>
        );

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
                Game History
            </h2>
            <div className="max-h-140 min-h-55 overflow-y-auto rounded-lg scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                {gameHistory.map((game) => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>
        </div>
    );
};

const GameCard = ({ game }: { game: GameDTOType }) => {
    const winner = game.winner || "No Winner";

    return (
            <div className="bg-gray-700/50 rounded-lg pl-2 my-2">
                <GameHeader winner={winner} date={game.createdAt} />
                <div className="flex items-center justify-evenly p-2">
                    {game.players.map((player) => (
                        <PlayerCard key={player.id} player={player} />
                    ))}
                </div>
            </div>
    );
};

const GameHeader = ({ winner, date }: { winner: string; date: Date }) => (
    <div className="flex justify-between px-4 pt-2 ">
        <span className="font-semibold">
            Winner: <span className="text-green-500/80 pl-1">{winner}</span>
        </span>
        <span className="text-sm text-white/70">
            {new Date(date).toLocaleDateString()}
        </span>
    </div>
);
