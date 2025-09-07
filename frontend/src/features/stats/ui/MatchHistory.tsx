import { getTime } from "@shared/lib/utisl";
import React from "react";
import { GameHistory } from "shared/dist";

export function MatchHistory({ history }: { history: GameHistory }) {
    return (
        <div className="glass-panel p-4 rounded-2xl">
            <h3 className="text-lg font-semibold mb-4">Match History</h3>
            <div className="divide-y divide-purple-800">
                {history.games.map((g) => (
                    <div
                        key={g.id}
                        className="py-3 px-2 flex items-center justify-between hover:bg-white/5 rounded-md transition"
                    >
                        <div>
                            <div className="font-semibold">
                                #{g.id} • {g.mode.toUpperCase()}
                            </div>
                            <div className="text-xs text-purple-200">
                                {getTime(g.createdAt)}
                            </div>
                        </div>
                        <div className="text-sm">
                            Winner:{" "}
                            <span className="font-bold">{g.winner ?? "-"}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
