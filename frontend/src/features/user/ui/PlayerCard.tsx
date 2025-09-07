import React from "react";
import { useNavigate } from "react";
import { GameUserDTOType } from "shared";
import { UserPicture } from "./UserPicture";

export const PlayerCard = ({ player }: { player: GameUserDTOType }) => {
    const navigate = useNavigate();

    return (
        <div className="group flex items-center justify-center w-full m-1 p-1 bg-gray-700/50 rounded-lg">
            <UserPicture user={player} size={8} />
            <div className="ml-3 ">
                <button
                    className="font-semibold group-hover:underline cursor-pointer"
                    onClick={() => navigate(`/profile/${player.username}`)}
                >
                    {player.username}
                </button>

                <p className="text-indigo-400 font-bold">
                    Score: {player.score}
                </p>
            </div>
        </div>
    );
};
