import React from "react";

interface ButtonProps {
    onClick: () => void;
    color?: "default" | "error" | "success" | "warning" | "info";
    className?: string;
    children?: ReactNode[];
}

export const Button = ({ onClick, children, color = "default", className = "" }: ButtonProps) => {

    const colorClasses = {
        default: "bg-blue-500 hover:bg-blue-600",
        error: "bg-red-500 hover:bg-red-600",
        success: "bg-green-500 hover:bg-green-600",
        warning: "bg-yellow-500 hover:bg-yellow-600",
        info: "bg-blue-500 hover:bg-blue-600",
    };

    return (
        <button
            onClick={onClick}
            className={`px-2 py-1 text-white rounded ${colorClasses[color]} ${className}`}
        >
            {children}
        </button>
    );
};
