import React from "react";

export function Stats() {
    return (
        <div className="w-full">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
                Stats
            </h2>
            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span className="font-semibold">Games Played</span>
                    <span className="text-indigo-400 font-bold">42</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span className="font-semibold">Wins</span>
                    <span className="text-green-400 font-bold">27</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span className="font-semibold">Losses</span>
                    <span className="text-red-400 font-bold">15</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span className="font-semibold">Win Rate</span>
                    <span className="text-yellow-400 font-bold">64%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span className="font-semibold">Longest Win Streak</span>
                    <span className="text-indigo-300 font-bold">8</span>
                </div>
            </div>
        </div>
    );
}
