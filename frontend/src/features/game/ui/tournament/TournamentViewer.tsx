import React from "react";
import { GameDTOType, TournamentUserDTOType } from "shared";

interface TournamentViewerProps {
    players: TournamentUserDTOType[];
    games: GameDTOType[];
}

export const TournamentViewer = ({ players, games }: TournamentViewerProps) => {
    return (
        <div className="w-full overflow-x-auto py-4">
            <p>Users:</p>
            {JSON.stringify(players)}
            <p>Games:</p>
            {JSON.stringify(games)}
        </div>
    );
};
