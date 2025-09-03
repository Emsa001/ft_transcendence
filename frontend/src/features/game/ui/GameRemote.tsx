import React, { useEffect, useNavigate } from "react";
import { GameRemoteRoom } from "./remote/GameRoom";
import { GameLobby } from "./remote/GameLobby";
import GameApi from "../service/GameAPI";
import { useUser } from "@features/auth/model/useUser";

interface GameRemoteElementProps {
    code?: string;
}

export const GameRemoteElement = ({ code }: GameRemoteElementProps) => {
    const { user } = useUser(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!code) return;

        GameApi.getGameByCode(code).then((game) => {
            if (!game) navigate("/game/remote");
        });
    }, [code]);

    if (code && user) {
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
