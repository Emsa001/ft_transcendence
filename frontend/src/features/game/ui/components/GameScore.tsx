import React from "react";
import { GameUserDTOType } from "shared";

const scoreClass =
    "px-4 py-2 bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl";

export const GameScore = ({ players }: { players: GameUserDTOType[] }) => {
    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex space-x-4 text-white text-2xl font-bold">
            {players.map((player) => (
                <div
                    key={player.id}
                    className={`${scoreClass} text-center min-w-[80px]`}
                >
                    <div className="text-xs text-white/70 mb-1">
                        {player.username}
                    </div>
                    <div className="text-3xl">{player.score}</div>
                </div>
            ))}
        </div>
    );
};
