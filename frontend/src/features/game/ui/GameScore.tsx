import React from "react";

interface GameScoreProps {
    scoreL: number;
    scoreR: number;
}

const scoreClass =
    "px-4 py-2 bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl ";

export const GameScore = ({ scoreL, scoreR }: GameScoreProps) => {
    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex space-x-8 text-white text-3xl font-bold">
            <div className={`${scoreClass}`}>{scoreL}</div>
            <div className={`${scoreClass}`}>{scoreR}</div>
        </div>
    );
};
