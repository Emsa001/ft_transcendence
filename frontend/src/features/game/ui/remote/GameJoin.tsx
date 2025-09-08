import React, { useState } from "react";
import { Modal } from "@shared/components/Modal";
import GameApi from "../../service/GameApi";
import { Button } from "@shared/components/Button";
import { useLanguage } from "@features/language/model/useLanguage";

type GameJoiningModalProps = {
    onClose?: () => void;
    onJoin?: (code: string) => void;
};

export const GameJoiningModal = ({
    onClose,
    onJoin,
}: GameJoiningModalProps) => {
    const [gameCode, setGameCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { getText } = useLanguage();
    const text = getText("remoteCasual.JoinGame");

    const handleSubmit = async () => {
        const code = gameCode.trim().toUpperCase();
        if (code.length != 6) return;

        // TODO: api request to check if game exists
        const game = await GameApi.getGameByCode(code);
        if (!game) {
            setError(text.gameNotFound);
            return;
        }

        onJoin?.(code);
        onClose?.();
    };

    const handleKeyPress = (e: any) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <div className="absolute w-full h-full ">
            <Modal isOpen={true} onClose={onClose}>
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent mb-2">
                        {text.joinGame}
                    </h2>
                    <p className="text-white/70 text-sm">
                        {text.enterGameCode}
                    </p>
                </div>

                {/* Game Code Input */}
                <div className="mb-8">
                    <label className="block text-sm font-semibold text-purple-300 mb-2">
                        {text.gameCode}
                    </label>
                    <input
                        id="gameCode"
                        type="text"
                        value={gameCode}
                        onChange={(e: any) => {
                            setGameCode(e.target.value);
                            setError(null); // Clear error when user types
                        }}
                        onKeyPress={handleKeyPress}
                        className="w-full rounded-xl bg-indigo-800/20 border border-white/10 px-4 py-3 text-purple-200 placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition uppercase tracking-wider text-center text-lg font-mono"
                        placeholder="Enter game code"
                        autoFocus
                        maxLength={6}
                        minLength={6}
                    />
                    {error && (
                        <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                            <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                            {error}
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-200 border border-white/10"
                    >
                        {text.cancel}
                    </button>
                    <Button
                        onClick={handleSubmit}
                        disabled={gameCode.trim().length !== 6}
                        className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                    >
                        {text.joinGame}
                    </Button>
                </div>
            </Modal>
        </div>
    );
};
