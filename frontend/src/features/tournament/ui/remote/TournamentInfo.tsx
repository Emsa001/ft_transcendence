import { stat } from "fs";
import { useLanguage } from "@features/language/model/useLanguage";
import { sliceText } from "@shared/lib/utils";
import React, { useNavigate } from "react";
import { GameStatus } from "shared";
import { finished } from "stream";

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
    const { getText } = useLanguage();
    const text = getText("tournament");

    const isLocal = onDelete === undefined;

    return (
        <div className="w-full col-span-2 h-full bg-white/10 p-4 rounded-2xl flex flex-col justify-between">
            <div>
                <h3 className="text-xl font-bold text-gray-200 mb-2 text-center">
                    {text.tournamentInfo}
                </h3>
            </div>
            <div className="">
                {status === GameStatus.WAITING ? (
                    <h2 className="text-2xl font-bold text-gray-200 mb-2 text-center">
                        Waiting for players... ({players}/{maxPlayers})
                    </h2>
                ) : status === GameStatus.IN_PROGRESS ? (
                    <h2 className="text-2xl font-bold text-gray-200 mb-2 text-center">
                        Tournament in progress...
                    </h2>
                ) : status === GameStatus.FINISHED ? (
                    <h2 className="text-2xl font-bold text-yellow-300 mb-2 text-center">
                        {text.winner}:{" "} - {winner}
                    </h2>
                ) : null}
            </div>

            <div>

            <div className="flex flex-row justify-center items-center gap-4 mb-4">
                <div className="">
                    {onDelete && (
                        <button
                        onClick={onDelete}
                        className="px-6 py-2 bg-gradient-to-r from-black to-black/60 text-white font-semibold rounded-xl shadow hover:opacity-90 transition w-full h-full"
                        >
                            {text.deleteTournament}
                        </button>
                    )}
                    {/* {onStart && status === GameStatus.WAITING && (
                        <button
                            onClick={onStart}
                            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow hover:opacity-90 transition w-full"
                        >
                            {text.startTournament}
                        </button>
                    )} */}
                </div>
                <button
                    onClick={() =>
                        navigate(`/game/${isLocal ? "remote/tournament" : ""}`)
                    }
                    className="px-6 py-2 bg-gradient-to-r from-red-800/80 to-red-600/80 text-white font-semibold rounded-xl shadow hover:opacity-90 transition"
                    >
                    {text.leaveTournament}
                </button>
                {onStart && status === GameStatus.WAITING && (
                    <button
                    onClick={onStart}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow hover:opacity-90 transition"
                    >
                        {text.startTournament}
                    </button>
                )}

            </div>

            <div className="p-4 border border-white/20 flex flex-col">
                <h3 className="text-xl font-bold text-gray-200 mb-2">
                    Tournament Settings
                </h3>
                <p className="text-white/80">
                    {text.host}:{" "}
                    <span className="font-medium text-white">{host || "N/A"}</span>
                </p>
                <p className="text-white/80">
                    {text.players}:{" "}
                    <span className="font-medium text-white">
                        {`${players}`} / {`${maxPlayers}`}
                    </span>
                </p>
                <p className="text-white/80">
                    {text.maxScore}:{" "}
                    <span className="font-medium text-white">{maxScore}</span>
                </p>
                <p className="text-white/80">
                    {text.randomEvents}:{" "}
                    <span className="font-medium text-white">
                        {randomEvents ? "Enabled" : "Disabled"}
                    </span>
                </p>

            </div>
            </div>

        {/* <section className="w-full col-span-2 h-full bg-white/10 p-4 rounded-2xl flex flex-col">
            
            <p className="text-white/80">
                Status: <span className="font-medium text-white">{status}</span>
            </p>


            <p className="text-white/80 mb-4">
                Winner:{" "}
                <span className="font-medium text-white">
                    {winner || "N/A"}
                </span>
            </p>

        </section>
            */}
        </div>
    );
};
