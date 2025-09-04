import React from "react";

interface TournamentRemoteProps {
    code?: string;
}

export const TournamentRemote = ({ code }: TournamentRemoteProps) => {
    return <div className="w-full h-full">Remote tournament</div>;
};
