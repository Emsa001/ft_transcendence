import React from "react";

interface FormInputProps {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    required?: boolean;

    [key: string]: any;
}

export const FormInput = ({ label, ...props }: FormInputProps) => (
    <div>
        <label className="block text-sm font-semibold text-purple-300">
            {label}
        </label>
        <input
            className="w-full rounded-lg bg-indigo-800/20 border border-transparent px-4 py-3 text-purple-200 placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            {...props}
        />
    </div>
);
