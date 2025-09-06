import { tournamentApi } from "@features/tournament/service/TournamentApi";
import { Modal } from "@shared/components/Modal";
import React, { useNavigate, useState } from "react";

export const TournamentCreate = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: Event) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const name = formData.get("name")?.toString().trim() || "";
        const maxPlayers = Number(formData.get("maxPlayers"));
        const maxScore = Number(formData.get("maxScore"));
        const randomEvents = formData.get("randomEvents") === "on";

        if (!name) return setError("Tournament name is required");
        if (maxPlayers < 2 || maxPlayers > 16)
            return setError("Max players must be between 2 and 16");
        if (maxScore < 1 || maxScore > 99)
            return setError("Max score must be between 1 and 99");

        const tournament = await tournamentApi.create({
            name,
            maxPlayers,
            maxScore,
            randomEvents,
        });

        if (!tournament) return setError("Failed to create tournament");

        navigate(`/game/remote/tournament/${tournament.uuid}`);
    };

    return (
        <div className="absolute right-4">
            <button
                onClick={() => setIsOpen(true)}
                className="px-3 py-2 rounded-2xl font-semibold bg-emerald-200/10 hover:bg-emerald-300/10 text-white shadow-lg transition"
            >
                Create Tournament
            </button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent mb-2">
                        Create Tournament
                    </h2>
                    <p className="text-white/70 text-sm">
                        Set up your tournament preferences
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-purple-300 mb-1">
                            Tournament Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter tournament name"
                            className="w-full rounded-xl bg-indigo-800/20 border border-white/10 px-4 py-3 text-purple-200 placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                        />
                    </div>

                    {/* Max Players */}
                    <div>
                        <label className="block text-sm font-semibold text-purple-300 mb-1">
                            Max Players
                        </label>
                        <input
                            type="number"
                            name="maxPlayers"
                            min={2}
                            max={16}
                            defaultValue={4}
                            className="w-full rounded-xl bg-indigo-800/20 border border-white/10 px-4 py-3 text-purple-200 placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                        />
                    </div>

                    {/* Max Score */}
                    <div>
                        <label className="block text-sm font-semibold text-purple-300 mb-1">
                            Max Score
                        </label>
                        <input
                            type="number"
                            name="maxScore"
                            min={1}
                            max={99}
                            defaultValue={10}
                            className="w-full rounded-xl bg-indigo-800/20 border border-white/10 px-4 py-3 text-purple-200 placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                        />
                    </div>

                    {/* Random Events */}
                    <div>
                        <label className="block text-sm font-semibold text-purple-300 mb-1">
                            Random Events
                        </label>
                        <input
                            type="checkbox"
                            name="randomEvents"
                            className="h-5 w-5"
                        />
                    </div>

                    {/* Error */}
                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-200 border border-white/10"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-pink-500 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                        >
                            Create Tournament
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
