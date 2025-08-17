import React from "react";
import { UserAvatar } from "./UserAvatar";
import { GameUserDTOType } from "shared";

export const PlayerCard = ({ player }: { player: GameUserDTOType }) => (
    <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-3">
        <UserAvatar name={player.username} src={player.avatar} />
        <div>
            <p className="font-semibold">{player.username}</p>
            <p className="text-sm text-white/70">Score: {player.score}</p>
        </div>
    </div>
);
