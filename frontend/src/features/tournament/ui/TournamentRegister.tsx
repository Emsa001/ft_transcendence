import React, { useEffect, useRef, useState } from "react";
import { ShinyText } from "@shared/components/Shiny";
import { TournamentUserDTOType } from "shared";
import { useLocalTournament } from "../model/LocalTournamentProvider";

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
                <StatusMessageComponent status={status} />
                <PlayerList
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

/* ------------------ Subcomponents ------------------ */

const AddPlayerInput = ({
    onAddPlayer,
}: {
    onAddPlayer: (e: Event) => void;
}) => (
    <form className="flex gap-3" onSubmit={onAddPlayer}>
        <input
            type="text"
            name="player"
            placeholder="Enter player alias"
            className="flex-1 px-4 py-2 rounded-xl bg-fuchsia-200/10 placeholder-gray-200 focus:outline-none focus:bg-fuchsia-300/10 transition"
        />
        <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-fuchsia-200/10 hover:bg-fuchsia-300/10 transition font-medium"
        >
            Add
        </button>
    </form>
);

const StatusMessageComponent = ({
    status,
}: {
    status: StatusMessage | null;
}) => (
    <div className="h-[1.25rem] text-center">
        <p
            className={`${
                status?.success ? "text-green-400" : "text-red-400"
            } text-sm transition-opacity ${status ? "opacity-100" : "opacity-0"}`}
        >
            {status?.message || " "}
        </p>
    </div>
);

const PlayerList = ({
    players,
    onRemovePlayer,
}: {
    players: TournamentUserDTOType[];
    onRemovePlayer: (username: string) => void;
}) => {
    const listRef = useRef<HTMLUListElement | null>(null);

    useEffect(() => {
        listRef.current?.scrollTo({
            top: listRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [players]);

    return (
        <ul
            className="h-[25vh] overflow-y-auto scrollbar-minimal space-y-2 p-3"
            ref={listRef}
        >
            {players.length === 0 && (
                <li className="text-gray-400 text-center">
                    No players registered yet.
                </li>
            )}
            {players.map((p) => (
                <li
                    key={p.username}
                    className="flex justify-between items-center p-2 rounded-xl bg-white/10 backdrop-blur-sm"
                >
                    <span className="text-gray-200">{p.username}</span>
                    <button
                        onClick={() => onRemovePlayer(p.username)}
                        className="text-red-400 hover:text-red-300 transition"
                    >
                        ✕
                    </button>
                </li>
            ))}
        </ul>
    );
};
