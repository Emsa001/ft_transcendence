import React from "react";

export function GameBackground() {
    return (
        <>
            {/* Decorative glows */}
            <div className="pointer-events-none absolute -top-24 -left-24 w-64 h-64 rounded-full bg-fuchsia-600/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-sky-500/30 blur-3xl" />
        </>
    );
}
