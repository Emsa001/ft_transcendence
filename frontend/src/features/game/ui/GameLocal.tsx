import React, { useState } from "react";
import { GameElement } from "./GameElement";
export const GameLocal = () => {
    const [maxScore, setMaxScore] = useState(5);

    return (
        <div className="w-full h-full">
            <h1>Max Score: {maxScore}</h1>
            <input
                type="range"
                min={1}
                max={20}
                value={maxScore}
                onChange={(e: any) => setMaxScore(parseInt(e.target.value, 10))}
            />
            <GameElement maxScore={maxScore} />
        </div>
    );
};
