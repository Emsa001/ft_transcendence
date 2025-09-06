import React from "react";
import { TournamentList } from "./remote/TournamentList";
import { TournamentCreate } from "./remote/TournamentCreate";
import { GameStatus } from "shared";
import { RemoteTournamentProvider } from "../model/useRemoteTournament";
import { RemoteTournamentViewer } from "./components/TournamentViewer";

interface TournamentRemoteProps {
    code?: string;
}

export const TournamentRemote = ({ code }: TournamentRemoteProps) => {
    if (code) {
        return (
            <div className="w-full h-full">
                <RemoteTournamentProvider uuid={code}>
                    <div className="w-full h-full flex items-center justify-center pt-12">
                        <RemoteTournamentViewer />
                    </div>
                </RemoteTournamentProvider>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center pt-12">
            <div className="relative w-full h-full flex flex-col">
                <TournamentCreate />
                <TournamentList
                    title="New Tournaments"
                    status={GameStatus.WAITING}
                />
                <TournamentList
                    title="Ongoing Tournaments"
                    status={GameStatus.IN_PROGRESS}
                    className="mt-auto"
                />
            </div>
        </div>
    );
};
