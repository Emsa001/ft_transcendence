import React from "react";
import { RegisterPlayerList } from "../components/PlayerList";
import { useRemoteTournament } from "@features/tournament/model/useRemoteTournament";

export const TournamentView = () => {
    const { players } = useRemoteTournament();

    return (
        <div className="w-full h-full flex items-center justify-center">
            <RegisterPlayerList players={players} />
        </div>
    );
};
