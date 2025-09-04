import React from "react";

export function GameBackground() {
    return (
        <div>
            {/* Decorative glows */}
            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-fuchsia-600/30 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-sky-500/30 blur-3xl" />
        </div>
    );
}
