import React from "react";

interface InputProps {
    type?: string;
    value: string;
    onChange: (e: HTMLInputElement) => void;
    placeholder?: string;
    className?: string;
}

export const Input = ({
    type = "text",
    value,
    onChange,
    placeholder = "",
    className = "",
}: InputProps) => {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`border rounded px-2 py-1 ${className}`}
        />
    );
};
