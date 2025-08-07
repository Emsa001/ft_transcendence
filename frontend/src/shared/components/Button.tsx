import React from "react";

interface ButtonProps extends DOMAttributes {
    color?: "default" | "error" | "success" | "warning" | "info" | "none";
    className?: string;
    children?: ReactNode;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    
    id?: string;
    name?: string;
    value?: string;
    autoFocus?: boolean;
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
}

export const Button = ({
    color = "default",
    className = "",
    children,
    ...rest
}: ButtonProps) => {
    const colorClasses = {
        default: "bg-blue-500 hover:bg-blue-600",
        error: "bg-red-500 hover:bg-red-600",
        success: "bg-green-500 hover:bg-green-600",
        warning: "bg-yellow-500 hover:bg-yellow-600",
        info: "bg-blue-500 hover:bg-blue-600",
        none: "bg-transparent hover:bg-gray-200",
    };

    return (
        <button
            className={`px-2 py-1 text-white rounded ${colorClasses[color]} ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
};
