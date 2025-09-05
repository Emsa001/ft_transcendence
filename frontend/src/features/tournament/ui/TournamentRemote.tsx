import React from "react";
import { TournamentList } from "./remote/TournamentList";
import { TournamentCreate } from "./remote/TournamentCreate";
import { TournamentView } from "./remote/TournamentView";
import { GameStatus } from "shared";
import { RemoteTournamentProvider } from "../model/useRemoteTournament";

interface TournamentRemoteProps {
    code?: string;
}

export const TournamentRemote = ({ code }: TournamentRemoteProps) => {
    if (code) {
        return (
            <div className="w-full h-full">
                <RemoteTournamentProvider uuid={code}>
                    <div className="w-full h-full">
                        <TournamentView />
                    </div>
                </RemoteTournamentProvider>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex items-center justify-center flex-col gap-4 pt-24 px-4">
            <TournamentCreate />
            <TournamentList title="Available to Join" />
            <TournamentList
                title="Ongoing Tournaments"
                status={GameStatus.IN_PROGRESS}
            />
        </div>
    );
};
