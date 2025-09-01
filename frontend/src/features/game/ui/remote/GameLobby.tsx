import React, { useNavigate } from "react";
import { ShinyText } from "@shared/components/Shiny";
import { GameCreationModal } from "../remote/GameCreation";
import { GameJoiningModal } from "../remote/GameJoin";
import { GameCreationAttributes } from "shared";
import { useGameLobby } from "@features/game/model/useGameLobby";
import GameApi from "../../service/GameAPI";

export const GameLobby = () => {
    const navigate = useNavigate();
    const { games, modal, setModal, sendMessage } = useGameLobby();

    const handleCreateGame = async (data: GameCreationAttributes) => {
        try {
            const res = await GameApi.createGame(data);
            navigate(`/game/${res.data}`);
        } catch (err) {
            console.error("Failed to create game", err);
        }
    };

    const handleJoinRandom = async () => {
        if (games <= 0) return;
        sendMessage({ type: "join_random" });
    };

    const handleJoinWithCode = (code: string) => {
        navigate(`/game/${code}`);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-12">
            <ShinyText
                text="Remote Casual"
                gradient="bg-logo-gradient"
                className="text-6xl font-extrabold text-center mb-6"
            />

            <div className="w-full max-w-5xl grid place-items-center grid-cols-1 md:grid-cols-3 gap-6 px-6">
                {/* Play Random */}
                <button
                    onClick={handleJoinRandom}
                    className={`relative flex flex-col items-center justify-center 
                        h-64 w-64 rounded-2xl font-semibold text-xl shadow-lg transition 
                        ${
                            games > 0
                                ? "bg-fuchsia-200/10 hover:bg-fuchsia-300/10 text-white"
                                : "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                        }`}
                >
                    Play Random
                    <span className="mt-2 text-sm opacity-80">
                        {games > 0
                            ? `${games} game${games > 1 ? "s" : ""} available`
                            : "No games"}
                    </span>
                    {games > 0 && (
                        <span className="absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-full bg-fuchsia-500 text-white shadow">
                            {games}
                        </span>
                    )}
                </button>

                {/* Create A Game */}
                <button
                    onClick={() => setModal("creating")}
                    className="h-64 w-64 rounded-2xl font-semibold text-xl bg-emerald-200/10 hover:bg-emerald-300/10 text-white shadow-lg transition flex items-center justify-center"
                >
                    Create A Game
                </button>

                {/* Join With Code */}
                <button
                    onClick={() => setModal("joining")}
                    className="h-64 w-64 rounded-2xl font-semibold text-xl bg-indigo-200/10 hover:bg-indigo-300/10 text-white shadow-lg transition flex items-center justify-center"
                >
                    Join With Code
                </button>
            </div>

            {/* Modals */}
            {modal === "creating" && (
                <GameCreationModal
                    onClose={() => setModal(null)}
                    onCreate={handleCreateGame}
                />
            )}
            {modal === "joining" && (
                <GameJoiningModal
                    onClose={() => setModal(null)}
                    onJoin={handleJoinWithCode}
                />
            )}
        </div>
    );
};
