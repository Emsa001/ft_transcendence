import React from "react";

interface ShinyProps {
    text: string;
    opacity?: number;
    gradient?: string;
    className?: string;
}

export const ShinyText = ({
    text,
    gradient = "from-red-500 via-blue-500 to-green-500",
    opacity = 100,
    className = "",
}: ShinyProps) => {
    return (
        <span className={`relative inline-block ${className}`}>
            {/* Drop shadow layer */}
            <span
                className={`absolute inset-0 ${gradient} text-transparent bg-clip-text blur-lg  select-none pointer-events-none`}
                aria-hidden="true"
                style={{ opacity: opacity / 100 }}
            >
                {text}
            </span>
            {/* Main text */}
            <span
                className={`relative ${gradient} text-transparent bg-clip-text`}
            >
                {text}
            </span>
        </span>
    );
};
