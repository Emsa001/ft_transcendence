import { useLanguage } from "@features/language/model/useLanguage";
import { tournamentApi } from "@features/tournament/service/TournamentApi";
import { Modal } from "@shared/components/Modal";
import React, { useNavigate, useState } from "react";

export const TournamentCreate = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState("");
    const { getText } = useLanguage();
    const text = getText("remoteTournament");

    const handleSubmit = async (e: Event) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const name = formData.get("name")?.toString().trim() || "";
        const maxPlayers = Number(formData.get("maxPlayers"));
        const maxScore = Number(formData.get("maxScore"));
        const randomEvents = formData.get("randomEvents") === "on";

        if (!name) return setError(text.createTournamentModal.nameIsRequired);
        if (maxPlayers < 2 || maxPlayers > 32)
            return setError(text.createTournamentModal.validMaxPlayers);
        if (maxScore < 1 || maxScore > 99)
            return setError(text.createTournamentModal.validMaxScore);

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
        <div className="align-middle text-center">
            <button
                onClick={() => setIsOpen(true)}
                className="px-8 py-6 rounded-3xl font-bold bg-emerald-500/30 hover:bg-emerald-400/20 text-white shadow-xl transition text-xl"
            >
                {text.createTournament}
            </button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent mb-2">
                        {text.createTournament}
                    </h2>
                    <p className="text-white/70 text-sm">
                        {text.createTournamentModal.setup}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-purple-300 mb-1">
                            {text.createTournamentModal.tournamentName}
                        </label>
                        <input
                            type="text"
                            name="name"
                            maxLength={32}
                            placeholder={
                                text.createTournamentModal.enterTournamentName
                            }
                            className="w-full rounded-xl bg-indigo-800/20 border border-white/10 px-4 py-3 text-purple-200 placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                        />
                    </div>

                    {/* Max Players */}
                    <div>
                        <label className="block text-sm font-semibold text-purple-300 mb-1">
                            {text.createTournamentModal.maxPlayers}
                        </label>
                        <input
                            type="number"
                            name="maxPlayers"
                            min={2}
                            max={32}
                            defaultValue={2}
                            className="w-full rounded-xl bg-indigo-800/20 border border-white/10 px-4 py-3 text-purple-200 placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                        />
                    </div>

                    {/* Max Score */}
                    <div>
                        <label className="block text-sm font-semibold text-purple-300 mb-1">
                            {text.createTournamentModal.maxScore}
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
                    <div className="mt-4 mb-8 flex items-center justify-between">
                        <span className="block text-sm font-semibold text-purple-300 mb-1">
                            {text.createTournamentModal.randomEvents}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                name="randomEvents"
                                type="checkbox"
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:bg-pink-600 transition-all"></div>
                            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-all peer-checked:translate-x-5"></div>
                        </label>
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
                            {text.createTournamentModal.cancel}
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-pink-500 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                        >
                            {text.createTournamentModal.createTournament}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
