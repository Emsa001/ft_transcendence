import React, { useEffect, useNavigate } from "react";
import { GameRemoteRoom } from "./remote/GameRoom";
import { GameLobby } from "./remote/GameLobby";
import GameApi from "../service/GameAPI";
import { useUser } from "@features/auth/model/useUser";

interface GameRemoteElementProps {
    code?: string;
}

export const GameRemoteElement = ({ code }: GameRemoteElementProps) => {
    const { user, loading } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate("/auth/login");
        }
    }, [loading, user]);

    useEffect(() => {
        if (!code) return;

        GameApi.getGameByCode(code).then((game) => {
            if (!game) navigate("/game");
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
