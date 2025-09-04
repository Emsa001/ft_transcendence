import React from "react";
import { GameUserDTOType } from "shared";
import { UserPicture } from "./UserPicture";

export const PlayerCard = ({ player }: { player: GameUserDTOType }) => (
    <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-3">
        <UserPicture userId={player.id} />
        <div>
            <p className="font-semibold">{player.username}</p>
            <p className="text-sm text-white/70">Score: {player.score}</p>
        </div>
    </div>
);
