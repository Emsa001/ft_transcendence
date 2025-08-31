import React from "react";

interface GameInviteProps {
    code: string;
    players: string[];
}

export const GameInvite = ({ code, players }: GameInviteProps) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4">Invite a Friend</h2>
            <p className="mb-4">
                Share the link below to invite a friend to join your game:
            </p>
            <input
                type="text"
                readOnly
                value={`${window.location.origin}/game/${code}`}
                className="w-full p-2 border border-gray-300 rounded"
                onFocus={(e: any) => e.target.select()}
            />
            <p className="mt-4 text-sm text-gray-500">
                Waiting for players... ({players.length} joined)
            </p>
            <ul className="mt-2">
                {players.map((p) => (
                    <li key={p}>{p}</li>
                ))}
            </ul>
        </div>
    );
};
