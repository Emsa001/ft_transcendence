import React from "react";

interface ShinyProps {
    text: string;
    opacity?: number;
    gradient?: string;
}

export const ShinyText = ({
    text,
    gradient = "from-red-500 via-blue-500 to-green-500",
    opacity = 100,
}: ShinyProps) => {
    return (
        <span className="relative inline-block">
            {/* Drop shadow layer */}
            <span
                className={`absolute inset-0 bg-gradient-to-r ${gradient} text-transparent bg-clip-text blur-lg  select-none pointer-events-none`}
                aria-hidden="true"
                style={{ opacity: opacity / 100 }}
            >
                {text}
            </span>
            {/* Main text */}
            <span className={`relative bg-gradient-to-r ${gradient} text-transparent bg-clip-text`}>
                {text}
            </span>
        </span>
    );
};
