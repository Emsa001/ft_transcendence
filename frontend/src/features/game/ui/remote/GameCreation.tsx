import React, { useState } from "react";
import { GameCreationAttributes } from "shared";
import { Modal } from "@shared/components/Modal";

type GameModalProps = {
    onClose?: () => void;
    onCreate?: (data: GameCreationAttributes) => void;
};

export const GameCreationModal = ({ onClose, onCreate }: GameModalProps) => {
    const [isPrivate, setIsPrivate] = useState(false);
    const [maxScore, setMaxScore] = useState(10);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = () => {
        if (!maxScore || maxScore < 1 || maxScore > 99) {
            setError("Please enter a valid max score in range 1-99");
            return;
        }
        onCreate?.({ isPrivate, maxScore });
        onClose?.();
    };

    return (
        <div className="absolute w-full h-full">
            <Modal isOpen={true} onClose={onClose}>
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent mb-2">
                        Create Game
                    </h2>
                    <p className="text-white/70 text-sm">
                        Set up your game preferences
                    </p>
                </div>

                {/* Private Game Toggle */}
                <div className="mb-6">
                    <label className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                        <div>
                            <span className="font-medium text-purple-300 group-hover:text-purple-200 transition-colors">
                                Private Game
                            </span>
                            <p className="text-xs text-white/50 mt-1">
                                Only friends can join with code
                            </p>
                        </div>
                        <div className="relative">
                            <input
                                type="checkbox"
                                onChange={(e: any) =>
                                    setIsPrivate(e.target.checked)
                                }
                                className="sr-only"
                            />
                            <div
                                className={`w-12 h-6 rounded-full transition-colors ${
                                    isPrivate
                                        ? "bg-gradient-to-r from-purple-500 to-fuchsia-500"
                                        : "bg-white/20"
                                }`}
                            >
                                <div
                                    className={`w-5 h-5 top-0 absolute bg-white rounded-full shadow-lg transform transition-transform ${
                                        isPrivate
                                            ? "translate-x-6"
                                            : "translate-x-0.5"
                                    } mt-0.5`}
                                />
                            </div>
                        </div>
                    </label>
                </div>

                {/* Max Score Input */}
                <div className="mb-8">
                    <label className="block text-sm font-semibold text-purple-300 mb-2">
                        Max Score
                    </label>
                    <input
                        id="maxScore"
                        type="number"
                        min={1}
                        max={99}
                        value={maxScore}
                        onChange={(e: any) => {
                            setMaxScore(Number(e.target.value));
                        }}
                        className="w-full rounded-xl bg-indigo-800/20 border border-white/10 px-4 py-3 text-purple-200 placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                        placeholder="Enter max score (1-99)"
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
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-pink-500 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                    >
                        Create Game
                    </button>
                </div>
            </Modal>
        </div>
    );
};
