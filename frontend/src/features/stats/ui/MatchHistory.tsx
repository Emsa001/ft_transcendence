import { getTime, sliceText } from "@shared/lib/utils";
import React from "react";
import { GameDTOType, GameUserDTOType } from "shared/dist";
import { FaRegClock } from "react-icons/fa";
import { Icon } from "@shared/components/Icon";
import { useLanguage } from "@features/language/model/useLanguage";

function GameCard({ game }: { game: GameDTOType }) {
    const { getText } = useLanguage();
    const text = getText("charts");

    const player1: GameUserDTOType = game.players[0];
    const player2: GameUserDTOType = game.players[1];

    const player1Name = player1?.username || "Player 1";
    const player2Name = player2?.username || "Player 2";

    const player1Score = player1?.score ?? 0;
    const player2Score = player2?.score ?? 0;

    const player1Won = game.winner === player1?.username;
    const player2Won = game.winner === player2?.username;

    const gameMode: string = game.randomEvents ? "Random Events" : "Casual";

    return (
        <div
            key={game.id}
            className="py-4 px-4 flex flex-col hover:bg-white/5 rounded-xl transition-all duration-200 border border-purple-900/30 mb-3"
        >
            <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-purple-300 bg-purple-900/30 px-2 py-1 rounded">
                    #{game.id} • {gameMode}
                </div>
                <div className="text-sm text-purple-200">
                    {getTime(game.createdAt)}
                </div>
            </div>

            <div className="grid grid-cols-7 items-center gap-2">
                {/* Player 1 */}
                <div className="col-span-3 text-right text-lg">
                    <div
                        className={`font-medium ${player1Won ? "text-green-300" : "text-white"}`}
                    >
                        {sliceText(player1Name, 10)}
                    </div>
                </div>

                {/* VS separator */}
                <div className="flex flex-col items-center justify-center col-span-1">
                    <div className="w-10 h-10 rounded-full bg-purple-800 flex items-center justify-center font-bold">
                        VS
                    </div>
                </div>

                {/* Player 2 */}
                <div className="col-span-3">
                    <div
                        className={`font-medium ${player2Won ? "text-green-300" : "text-white"}`}
                    >
                        {sliceText(player2Name, 10)}
                    </div>
                </div>
            </div>

            {/* Score display */}
            <div className="grid grid-cols-7 items-center gap-2">
                <div className="col-span-3 text-right">
                    <div
                        className={`text-xl font-bold ${player1Won ? "text-green-400" : "text-purple-200"}`}
                    >
                        {player1Score}
                    </div>
                </div>

                <div className="col-span-1 text-center text-sm text-purple-400">
                    {text.score}
                </div>

                <div className="col-span-3">
                    <div
                        className={`text-xl font-bold ${player2Won ? "text-green-400" : "text-purple-200"}`}
                    >
                        {player2Score}
                    </div>
                </div>
            </div>

            {/* Winner banner */}
            <div className="mt-2 pt-2 border-t border-purple-800/50 flex justify-center">
                <div className="text-xs font-semibold bg-gradient-to-r from-purple-900/40 to-pink-900/40 px-3 py-1 rounded-full">
                    {text.winner}:{" "}
                    <span className="text-green-300">
                        {sliceText(game.winner || "", 10)}
                    </span>
                </div>
            </div>
        </div>
    );
}

export function MatchHistory({ games }: { games: GameDTOType[] }) {
    const { getText } = useLanguage();
    const text = getText("charts");
    return (
        <div className="glass-panel p-5 rounded-2xl">
            <h3 className="text-xl font-bold mb-5 text-purple-100 flex items-center gap-2">
                <Icon icon={FaRegClock} className="text-purple-300 w-5 h-5" />
                {text.matchHistory}
            </h3>
            <div className="divide-y divide-purple-800 max-h-96 overflow-y-auto">
                {games.map((game) => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>
        </div>
    );
}
