import React from "react";
import { GameDTOType, TournamentDTOType } from "shared";
import { PlayerCard } from "./PlayerCard";

import { FaCrown } from "react-icons/fa";
import { Icon } from "@shared/components/Icon";
import { useLanguage } from "@features/language/model/useLanguage";
import { getTime } from "@shared/lib/utisl";

interface PlayerGameHistoryProps {
    games: GameDTOType[];
}

interface PlayerTournamentHistoryProps {
    tournaments: TournamentDTOType[];
}

export const PlayerGameHistory = ({ games }: PlayerGameHistoryProps) => {
    const { getText } = useLanguage();
    const text = getText("profile.history");

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
                {text.gameHistory}
            </h2>
            <div className="max-h-140 min-h-55 overflow-y-auto rounded-lg scrollbar-minimal px-2">
                {games.map((game) => (
                    <GameCard key={game.id} game={game} />
                ))}
                {games.length === 0 && (
                    <p className="h-124 text-gray-300 text-center">
                        {text.noGames}
                    </p>
                )}
            </div>
        </div>
    );
};

export const PlayerTournamentHistory = ({
    tournaments,
}: PlayerTournamentHistoryProps) => {
    const { getText } = useLanguage();
    const text = getText("profile.history");

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
                {text.tournamentHistory}
            </h2>
            <div className="max-h-140 min-h-55 overflow-y-auto rounded-lg scrollbar-minimal px-2">
                {tournaments.map((tournament) => (
                    <TournamentCard
                        key={tournament.id}
                        tournament={tournament}
                    />
                ))}
                {tournaments.length === 0 && (
                    <p className="h-124 text-gray-300 text-center">
                        {text.noTournaments}
                    </p>
                )}
            </div>
        </div>
    );
};

const TournamentCard = ({ tournament }: { tournament: TournamentDTOType }) => {
    return (
        <div className="bg-gray-700/50 rounded-lg p-3 my-2 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-600 pb-1 mb-2">
                <h3 className="text-lg font-semibold text-gray-100">
                    {tournament.name}
                </h3>
                <span className="text-sm text-gray-400">
                    {getTime(tournament.createdAt)}
                </span>
            </div>

            {/* Info */}
            <div className="flex justify-between gap-2 text-sm text-gray-300">
                <div>
                    <span className="font-medium text-gray-200">Players:</span>{" "}
                    {tournament.players.length}/{tournament.maxPlayers}
                </div>
                <div className="flex items-center">
                    <Icon icon={FaCrown} className="text-yellow-400 mr-1" />
                    <span>{tournament.winner || "—"}</span>
                </div>
            </div>
        </div>
    );
};

const GameCard = ({ game }: { game: GameDTOType }) => {
    const winner = game.winner || "No Winner";

    return (
        <div className="bg-gray-700/50 rounded-lg pl-2 my-2">
            <GameHeader winner={winner} date={game.createdAt} />
            <div className="flex items-center justify-evenly p-2">
                {game.players.map((player) => (
                    <PlayerCard key={player.id} player={player} />
                ))}
            </div>
        </div>
    );
};

const GameHeader = ({ winner, date }: { winner: string; date: Date }) => (
    <div className="flex justify-between px-4 pt-2 ">
        <div className="flex items-center">
            <Icon icon={FaCrown} className="text-yellow-400 mr-1" />
            <span>{winner || "—"}</span>
        </div>
        <span className="text-sm text-white/70">{getTime(date)}</span>
    </div>
);
