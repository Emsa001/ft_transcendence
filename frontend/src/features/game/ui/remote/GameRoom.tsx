import React, { Link } from "react";
import { useRemoteGame } from "@features/game/model/useRemoteGame";
import { GameStatus } from "shared";
import { GameElementRemote } from "../components/GameElement";
import { GameWaiting } from "./GameWaiting";
import { useLanguage } from "@features/language/model/useLanguage";
import { Toast } from "@shared/lib/Toast";
import { sliceText } from "@shared/lib/utils";

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
        isTournament,
    } = useRemoteGame();

    const { getText } = useLanguage();
    const text = getText("remoteCasual.gameRemoteRoom");

    const renderStatus = () => {
        switch (status) {
            case GameStatus.WAITING:
                return text.waitingForPlayers;
            case GameStatus.IN_PROGRESS:
                return `${text.round} ${round} / ${text.maxScore} ${maxScore}`;
            case GameStatus.FINISHED:
                return winner ? `${text.winner} ${winner}` : text.gameFinished;
            default:
                return text.connecting;
        }
    };

    if (error) {
        return (
            <span className="text-red-500 text-lg font-semibold">{error}</span>
        );
    }

    if (!player) {
        return <div />;
    }

    if (status === GameStatus.IN_PROGRESS) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <GameElementRemote />
            </div>
        );
    }

    if (isTournament && status === GameStatus.WAITING) {
        return (
            <div className="w-full h-full">
                <GameWaiting />
            </div>
        );
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        Toast.success("Game code copied to clipboard");
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg p-6 mb-6 text-center">
                <h2 className="text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                    {text.gameRoom}
                </h2>
                <div
                    onClick={handleCopy}
                    className="w-full rounded-xl bg-indigo-800/40 border border-white/10 px-4 py-3 text-purple-200 cursor-pointer text-center text-lg font-mono tracking-[0.7em]"
                >
                    {code}
                </div>

                <p className="text-gray-200 mt-2 mb-2">{renderStatus()}</p>
                {isPrivate && (
                    <span className="text-sm text-yellow-300 font-medium">
                        {text.privateGame}
                    </span>
                )}
            </div>

            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-sm p-4 mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                    {text.players}: {players.length}/{maxPlayers}
                </h3>
                <ul className="space-y-2">
                    {players.map((player) => (
                        <li
                            key={player.id}
                            className="flex items-center justify-between px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition text-white"
                        >
                            <span>
                                {sliceText(player.username, 10)}{" "}
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

    const { getText } = useLanguage();
    const text = getText("remoteCasual.gameRemoteRoom");

    if (status === GameStatus.FINISHED) {
        return (
            <Link
                to="/game/remote/casual"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
                {text.returnToLobby}
            </Link>
        );
    }

    if (!isHost) {
        return <div className="text-gray-400">{text.waitingForHost}</div>;
    }

    if (playerSize < 2) {
        return (
            <p className="text-gray-400 mb-4">{text.waitingForMorePlayers}</p>
        );
    }

    return (
        <button
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform"
            onClick={handleStartGame}
        >
            {text.startGame}
        </button>
    );
};
