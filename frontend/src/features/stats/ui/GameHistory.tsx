import React, { useEffect } from "react";
import { useStats } from "../model/useStats";

/*
    Test component to display game history.
    usage: <GameHistory userId={1} /> // will fetch and display game history for user with ID 1
*/
export const GameHistory = ({ userId }: { userId: string | number }) => {
    const { fetchGameHistory, gameHistory, loading, error } = useStats();

    useEffect(() => {
        if (userId) {
            fetchGameHistory(userId);
        }
    }, [userId]);

    return (
        <div>
            <h1>Game History</h1>
            <p>This is where the game history will be displayed.</p>
            <div className="flex flex-col gap-4 mt-4">
                {gameHistory.map((game) => (
                    <div key={game.id}>
                        <h2>
                            Winner:{" "}
                            {
                                game.players.find((e) => e.id === game.winner)
                                    ?.name
                            }
                        </h2>
                        <p>
                            Date:{" "}
                            {new Date(game.createdAt).toLocaleDateString()}
                        </p>
                        <div>
                            {game.players.map((player) => (
                                <div key={player.id}>
                                    <p>Player: {player.name}</p>
                                    <p>Score: {player.score}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
