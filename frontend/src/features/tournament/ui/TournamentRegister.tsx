import React, { useState } from "react";
import { ShinyText } from "@shared/components/Shiny";
import { AddPlayerInput } from "./components/AddPlayer";
import { RegisterPlayerList } from "./components/PlayerList";
import { useLocalTournament } from "../model/useLocalTournament";

export const TournamentRegister = () => {
    const { players, maxPlayers, addPlayer, removePlayer, startTournament } =
        useLocalTournament();

    const [status, setStatus] = useState<StatusMessage | null>(null);

    const handleAddPlayer = (e: Event) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const alias = formData.get("player")?.toString().trim();

        if (!alias) {
            setStatus({ message: "Alias cannot be empty.", success: false });
            return;
        }

        setStatus(addPlayer(alias));
        form.reset();
    };

    const handleRemovePlayer = (username: string) => {
        removePlayer(username);
        setStatus(null);
    };

    return (
        <div className="flex flex-col gap-12 w-full items-center">
            <ShinyText
                text="Tournament Registration"
                gradient="bg-logo-gradient"
                className="text-5xl font-extrabold text-center mb-6"
            />

            <div className="h-full w-full max-w-xl p-6 rounded-3xl bg-white/5 backdrop-blur-lg shadow-xl text-white flex flex-col gap-6">
                <AddPlayerInput onAddPlayer={handleAddPlayer} />

                <p
                    className={`h-[1.25rem] text-center ${
                        status?.success ? "text-green-400" : "text-red-400"
                    } text-sm transition-opacity ${status ? "opacity-100" : "opacity-0"}`}
                >
                    {status?.message || " "}
                </p>

                <RegisterPlayerList
                    players={players}
                    onRemovePlayer={handleRemovePlayer}
                />

                <button
                    onClick={startTournament}
                    className="py-3 rounded-2xl font-semibold bg-fuchsia-200/10 hover:bg-fuchsia-300/10 transition text-white shadow-md"
                >
                    Start Tournament {players.length}/{maxPlayers}
                </button>
            </div>
        </div>
    );
};
