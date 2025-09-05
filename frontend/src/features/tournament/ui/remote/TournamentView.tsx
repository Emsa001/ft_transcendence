import React from "react";
import { RegisterPlayerList } from "../components/PlayerList";
import { useRemoteTournament } from "@features/tournament/model/useRemoteTournament";

export const TournamentView = () => {
    const { players, start, status, host, error } = useRemoteTournament();

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <RegisterPlayerList players={players} />
            <div>Status: {status}</div>
            <div>Host: {host}</div>
            <div>{error}</div>
            <button onClick={start}>Start</button>
        </div>
    );
};
