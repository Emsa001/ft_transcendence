import React, { useNavigate } from "react";
import { GameStatus } from "shared";

interface TournamentInfoProps {
    status: GameStatus | null;
    host?: string;
    players: number;
    maxPlayers: number;
    winner: string | null;
    randomEvents: boolean;
    maxScore: number;
    onStart?: () => void;
    onDelete?: () => void;
}

export const TournamentInfo = ({
    status,
    host,
    players,
    maxPlayers,
    winner,
    randomEvents,
    maxScore,
    onStart,
    onDelete,
}: TournamentInfoProps) => {
    const navigate = useNavigate();

    const isLocal = onDelete === undefined;

    return (
        <section className="w-full col-span-2 h-full bg-white/10 p-4 rounded-2xl flex flex-col">
            <h3 className="text-xl font-bold text-gray-200 mb-2 text-center">
                Tournament info
            </h3>
            <p className="text-white/80">
                Status: <span className="font-medium text-white">{status}</span>
            </p>
            <p className="text-white/80">
                Host:{" "}
                <span className="font-medium text-white">{host || "N/A"}</span>
            </p>

            <p className="text-white/80">
                Random Events:{" "}
                <span className="font-medium text-white">
                    {randomEvents ? "Enabled" : "Disabled"}
                </span>
            </p>

            <p className="text-white/80">
                Max Score:{" "}
                <span className="font-medium text-white">{maxScore}</span>
            </p>

            <p className="text-white/80">
                Players:{" "}
                <span className="font-medium text-white">
                    {`${players}`} / {`${maxPlayers}`}
                </span>
            </p>
            <p className="text-white/80 mb-4">
                Winner:{" "}
                <span className="font-medium text-white">
                    {winner || "N/A"}
                </span>
            </p>

            <div className="mt-auto flex flex-col gap-4 justify-center">
                <div className="w-full h-full">
                    {onDelete && (
                        <button
                            onClick={onDelete}
                            className="px-6 py-2 bg-gradient-to-r from-black to-black/60 text-white font-semibold rounded-xl shadow hover:opacity-90 transition w-full h-full"
                        >
                            Delete Tournament
                        </button>
                    )}
                </div>
                <button
                    onClick={() =>
                        navigate(`/game/${isLocal ? "remote/tournament" : ""}`)
                    }
                    className="px-6 py-2 bg-gradient-to-r from-red-800 to-red-600 text-white font-semibold rounded-xl shadow hover:opacity-90 transition"
                >
                    Leave Tournament
                </button>
                <div className="w-full h-full">
                    {onStart && status === GameStatus.WAITING && (
                        <button
                            onClick={onStart}
                            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow hover:opacity-90 transition w-full"
                        >
                            Start Tournament
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};
