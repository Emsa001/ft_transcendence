import React, { useNavigate } from "react";

interface GameHeaderProps {
    type: "local" | "remote";
    mode: "casual" | "tournament";
    code?: string;
}

export const GameHeader = ({ type, mode, code }: GameHeaderProps) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (code) {
            // If inside a game with a code → go one level up
            navigate(`/game/${type}/${mode}`);
        } else if (type && mode) {
            // If inside a mode menu → go back to game root
            navigate(`/game`);
        } else {
            // Fallback
            navigate("/");
        }
    };

    return (
        <div className="p-4 flex items-center justify-between border border-white/10 bg-black/20 backdrop-blur-md rounded-t-2xl">
            <div className="px-4 py-2 rounded-2xl bg-white/10 shadow-lg">
                <h1 className="text-lg md:text-xl font-semibold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-sky-300">
                    {type === "local" &&
                        mode === "casual" &&
                        "Local Casual Mode"}
                    {type === "local" &&
                        mode === "tournament" &&
                        "Local Tournament Mode"}
                    {type === "remote" &&
                        mode === "casual" &&
                        "Remote Casual Mode"}
                    {type === "remote" &&
                        mode === "tournament" &&
                        "Remote Tournament Mode"}
                </h1>
            </div>
            <button
                onClick={handleBack}
                className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-200 shadow-lg text-sm md:text-base"
            >
                Back to Menu
            </button>
        </div>
    );
};
