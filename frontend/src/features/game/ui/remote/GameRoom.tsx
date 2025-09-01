import React from "react";
import { GameCreationAttributes } from "shared";
import { useRemoteGame } from "@features/game/model/useRemoteGame";

interface GameRemoteRoomProps {
    code: string;
}

export const GameRemoteRoom = ({ code }: GameRemoteRoomProps) => {
    const data = useRemoteGame(code);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            {/* <GameInvite code={gameCode} players={players} /> */}
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Start Game
            </button>
        </div>
    );
};
