import { tournamentApi } from "@features/tournament/service/TournamentApi";
import React, { useEffect, useRef, useState } from "react";
import { GameStatus, TournamentDTOType } from "shared";
import { TournamentCard } from "./TournamentCard";

interface TournamentListProps {
    title?: string;
    status?: GameStatus;
}

export const TournamentList = ({ title, status }: TournamentListProps) => {
    const [tournaments, setTournaments] = useState<TournamentDTOType[]>([]);
    const [hasMore, setHasMore] = useState(false);
    const offset = useRef(0);

    const getMore = async () => {
        const data = await tournamentApi.getAll({
            offset: offset.current,
            status,
        });
        if (data) {
            setTournaments((prev) => [...prev, ...data.tournaments]);
            offset.current += data.tournaments.length;
            setHasMore(data.hasMore);
        }
    };

    useEffect(() => {
        getMore();
    }, []);

    return (
        <div className="p-4 space-y-4 w-full h-full flex flex-col max-h-1/2">
            {/* Title stays fixed */}
            <h2 className="text-2xl font-bold flex-shrink-0">{title}</h2>

            {/* Scrollable list */}
            <div className="overflow-y-auto">
                <div className="flex flex-wrap gap-4">
                    {tournaments.map((tournament) => (
                        <TournamentCard
                            key={tournament.uuid}
                            tournament={tournament}
                        />
                    ))}
                    {tournaments.length === 0 && (
                        <p className="text-gray-400">No tournaments found.</p>
                    )}
                </div>

                {hasMore && (
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={getMore}
                            className="px-6 py-2 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition"
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
