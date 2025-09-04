import React, { useNavigate } from "react";
import { GameStatus, TournamentDTOType } from "shared";

interface TournamentCardProps {
    tournament: TournamentDTOType;
}

export const TournamentCard = ({ tournament }: TournamentCardProps) => {
    const navigate = useNavigate();

    return (
        <div
            className="rounded-2xl p-6 shadow-lg hover:shadow-2xl transition 
                        bg-gradient-to-br from-purple-900/40 to-blue-900/40 
                        border border-white/10 backdrop-blur-xl"
        >
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-white">
                    {tournament.name}
                </h3>
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm
                        ${
                            tournament.status === GameStatus.WAITING
                                ? "bg-green-400/20 text-green-300"
                                : tournament.status === GameStatus.IN_PROGRESS
                                  ? "bg-yellow-400/20 text-yellow-300"
                                  : "bg-gray-400/20 text-gray-300"
                        }`}
                >
                    {tournament.status}
                </span>
            </div>

            <div className="text-sm text-gray-300 space-y-1 mb-5">
                <p>
                    Players:{" "}
                    <span className="font-medium text-white">
                        {tournament.players.length} / {tournament.maxPlayers}
                    </span>
                </p>
                <p>
                    Max Score:{" "}
                    <span className="font-medium text-white">
                        {tournament.maxScore}
                    </span>
                </p>
                <p>
                    Round:{" "}
                    <span className="font-medium text-white">
                        {tournament.round}
                    </span>
                </p>
            </div>

            <button
                onClick={() =>
                    navigate(`/game/remote/tournament/${tournament.uuid}`)
                }
                className="w-full py-2 px-4 rounded-xl font-medium 
                           bg-gradient-to-r from-purple-600 to-blue-600 
                           text-white hover:from-purple-500 hover:to-blue-500 
                           transition"
            >
                Join
            </button>
        </div>
    );
};
