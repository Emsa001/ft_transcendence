import React, { useNavigate } from "react";
import { GameRemoteRoom } from "./remote/GameRoom";
import { GameLobby } from "./remote/GameLobby";
import { GameCreationAttributes } from "shared";

interface GameRemoteElementProps {
    code?: string;
}

export const GameRemoteElement = ({ code }: GameRemoteElementProps) => {
    if (code) {
        return (
            <div className="w-full h-full">
                <GameRemoteRoom code={code} />
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            <GameLobby />
        </div>
    );
};
