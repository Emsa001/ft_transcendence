import React, { useState } from "react";
import { useLocalTournament } from "../../model/useLocalTournament";
import { useLanguage } from "@features/language/model/useLanguage";

function TournamentOptions() {
    const { setRandomEvents, setMaxScore } = useLocalTournament();
    const [isEnabled, setIsEnabled] = useState(false);
    const { getText } = useLanguage();
    const text = getText("tournament");

    const handleMaxScoreChange = (e: any) => {
        const score = parseInt(e.target.value, 10);
        setMaxScore(score);
    };

    const handleRandomEventsChange = () => {
        setIsEnabled(!isEnabled);
        setRandomEvents(!isEnabled);
    };

    return (
        <div className="flex items-center justify-between gap-8">
            {/* Max Score Input */}
            <div className="flex flex-col flex-1">
                <label
                    htmlFor="max-score-input"
                    className="text-lg text-center font-semibold text-pink-400 mb-2"
                >
                    {text.maxScore} (1-21)
                </label>
                <input
                    id="max-score-input"
                    type="number"
                    value={1}
                    min="1"
                    max="21"
                    onChange={handleMaxScoreChange}
                    className="px-4 py-2 rounded-2xl border border-gray-600 bg-gray-900/70 text-white focus:ring-2 focus:ring-pink-500 focus:outline-none transition"
                />
            </div>

            {/* Random Events Toggle */}
            <div className="flex flex-col flex-1">
                <label className="text-lg text-center font-semibold text-pink-400 mb-2">
                    {text.randomEvents}
                </label>
                <button
                    type="button"
                    onClick={handleRandomEventsChange}
                    className={`px-4 py-2 rounded-2xl font-medium transition shadow-md
                        ${
                            isEnabled
                                ? "bg-gradient-to-r from-purple-700 via-purple-800 to-pink-900 hover:from-purple-800 hover:to-pink-950 text-white"
                                : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                        }`}
                >
                    {isEnabled ? text.enabled : text.disabled}
                </button>
            </div>
        </div>
    );
}

export { TournamentOptions };
