import React, { Link } from "react";
import { useRemoteGame } from "@features/game/model/useRemoteGame";
import { GameStatus } from "shared";
import { GameElementRemote } from "../components/GameElement";

export const GameRemoteRoom = () => {
    const {
        player,
        players,
        status,
        maxPlayers,
        winner,
        round,
        maxScore,
        isPrivate,
        host,
        code,
        error,
    } = useRemoteGame();

    const renderStatus = () => {
        switch (status) {
            case GameStatus.WAITING:
                return "Waiting for players...";
            case GameStatus.IN_PROGRESS:
                return `Round ${round} / Max Score ${maxScore}`;
            case GameStatus.FINISHED:
                return winner ? `Winner: ${winner}` : "Game finished!";
            default:
                return "Connecting...";
        }
    };

    if (error) {
        return (
            <span className="text-red-500 text-lg font-semibold">{error}</span>
        );
    }

    if (!player) {
        return <div>Loading Player</div>;
    }

    if (status === GameStatus.IN_PROGRESS) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <GameElementRemote />
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg p-6 mb-6 text-center">
                <h2 className="text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                    Game Room: {code}
                </h2>
                <p className="text-gray-200 mb-2">{renderStatus()}</p>
                {isPrivate && (
                    <span className="text-sm text-yellow-300 font-medium">
                        Private Game
                    </span>
                )}
            </div>

            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-sm p-4 mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                    Players: {players.length}/{maxPlayers}
                </h3>
                <ul className="space-y-2">
                    {players.map((player) => (
                        <li
                            key={player.id}
                            className="flex items-center justify-between px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition text-white"
                        >
                            <span>
                                {player.username}{" "}
                                {host === player.id && "(Host)"}
                            </span>
                            <span className="text-sm text-gray-200">
                                ID: {player.id}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            <GameActionButtons />
        </div>
    );
};

const GameActionButtons = () => {
    const { player, players, host, status, handleStartGame, maxPlayers } =
        useRemoteGame();
    const playerSize = players.length;
    const isHost = player?.id === host;

    if (status === GameStatus.FINISHED) {
        return (
            <Link
                to="/game/remote/casual"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
                Return to Lobby
            </Link>
        );
    }

    if (!isHost) {
        return (
            <div className="text-gray-400">
                Waiting for host to start the game...
            </div>
        );
    }

    if (playerSize < 2) {
        return (
            <p className="text-gray-400 mb-4">
                Waiting for more players to join...
            </p>
        );
    }

    return (
        <button
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform"
            onClick={handleStartGame}
        >
            Start Game
        </button>
    );
};
