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
                    <div className="w-full h-full flex items-center justify-center pt-12 background-blue-500">
                        <RemoteTournamentViewer />
                    </div>
                </RemoteTournamentProvider>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-start pt-6">
            <div className="w-full h-full flex flex-col gap-6 p-6 items-center justify-between px-10">
                <div className="w-full h-full flex flex-row flex-3 justify-evenly gap-6 items-stretch">
                    <div className="w-full border rounded-xl border-white/30 p-5">
                        <TournamentList
                            title="New Tournaments"
                            status={GameStatus.WAITING}
                            />
                    </div>
                    <div className="w-full border rounded-xl border-white/30 p-5">
                        <TournamentList
                            title="Ongoing Tournaments"
                            status={GameStatus.IN_PROGRESS}
                            className="mt-auto"
                            />
                    </div>
                </div>
                <div className="w-full flex-1 justify-center items-baseline mt-auto mt-6 pt-5">
                    <TournamentCreate />
                </div>
            </div>
        </div>
    );
};
