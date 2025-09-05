import React from "react";
import { useNavigate } from "react";
import { GameUserDTOType } from "shared";
import { UserPicture } from "./UserPicture";
import { OtherUserPicture } from "./UserPicture";

export const PlayerCard = ({ player }: { player: GameUserDTOType }) => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center w-full m-1 p-1 bg-gray-700/50 rounded-lg">
            <UserPicture userId={player.id} size={8} />
            <div className="ml-3 ">
                <button className="font-semibold hover:underline cursor-pointer"
                onClick={() => navigate(`/profile/${player.username}`)}
                >
                    {player.username}
                </button>

                <p className="text-indigo-400 font-bold">Score: {player.score}</p>
            </div>
        </div>
    );
};
