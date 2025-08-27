import React, { useState } from "react";
import { TournamentUserDTOType } from "shared";

interface TournamentRegisterElementProps {
    startTournament: () => void;
    addPlayer: (player: string) => boolean;
    removePlayer: (player: string) => void;
    players: TournamentUserDTOType[];
}

export const TournamentRegisterElement = ({
    startTournament,
    addPlayer,
    removePlayer,
    players,
}: TournamentRegisterElementProps) => {
    const [username, setUsername] = useState("");
    const [error, setError] = useState<string>("");

    const handleAddPlayer = () => {
        const trimmed = username.trim();
        if (!trimmed) {
            setError("Alias cannot be empty.");
            return;
        }
        if (addPlayer(trimmed) === false) {
            setError("This alias is already registered.");
            return;
        }
        setUsername("");
        setError("");
    };

    const handleRemovePlayer = (name: string) => {
        setError("");
        removePlayer(name);
    };

    return (
        <div className="flex flex-col">
            <h2
                className="text-4xl font-extrabold mb-6 text-center 
                           bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 
                           bg-clip-text text-transparent"
            >
                Tournament Registration
            </h2>

            {/* Input */}
            <div className="flex items-center gap-2 mb-3">
                <input
                    type="text"
                    value={username}
                    onChange={(e: any) => setUsername(e.target.value)}
                    placeholder="Enter player alias"
                    className="flex-1 px-4 py-2 rounded-xl 
                               bg-white/10 border border-white/20 
                               text-white placeholder-white/50
                               focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                    onClick={handleAddPlayer}
                    className="px-5 py-2 rounded-xl font-semibold 
                               bg-gradient-to-r from-indigo-600 to-purple-600 
                               hover:from-indigo-500 hover:to-purple-500 
                               transition"
                >
                    Add
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
            )}

            {/* Player List */}
            <div className="flex-1 overflow-y-auto mb-6 custom-scrollbar">
                <ul className="space-y-3">
                    {players.map((p, i) => (
                        <li
                            key={p.username}
                            className="flex justify-between items-center 
                                           px-4 py-2 rounded-xl
                                           bg-gradient-to-r from-white/10 to-white/5
                                           border border-white/10"
                        >
                            <span className="font-medium">{p.username}</span>
                            <button
                                onClick={() => handleRemovePlayer(p.username)}
                                className="text-red-400 hover:text-red-300 transition"
                            >
                                ✕
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Start Button */}
            <button
                onClick={() => startTournament()}
                className="px-8 py-3 rounded-2xl font-bold 
                           bg-gradient-to-r from-green-500 to-emerald-600
                           hover:from-green-400 hover:to-emerald-500 
                           transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
                Start Tournament
            </button>
        </div>
    );
};
