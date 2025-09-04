import React, { useEffect, useNavigate } from "react";
import { GameRemoteRoom } from "./remote/GameRoom";
import { GameLobby } from "./remote/GameLobby";
import { useUser } from "@features/auth/model/useUser";
import GameApi from "../service/GameApi";
import { RemoteGameProvider } from "../model/useRemoteGame";
import { Toast } from "@shared/lib/Toast";

interface GameRemoteElementProps {
    code?: string;
}

export const GameRemote = ({ code }: GameRemoteElementProps) => {
    const { user } = useUser(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!code) return;

        GameApi.getGameByCode(code).then((game) => {
            if (!game) {
                Toast.error("Game not found");
                navigate("/game/remote");
            }
        });
    }, [code]);

    if (code && user) {
        return (
            <div className="w-full h-full">
                <RemoteGameProvider code={code}>
                    <div className="w-full h-full flex items-center justify-center pt-8">
                        <GameRemoteRoom />
                    </div>
                </RemoteGameProvider>
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            <GameLobby />
        </div>
    );
};
