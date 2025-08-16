import React from "react";

export function InfoHandler({
    input,
    value,
    readonly,
}: {
    input: string;
    value: string;
    readonly?: boolean;
}) {
    return (
        <div>
            <label className="text-sm text-white">{input}</label>
            {readonly ? (
                <p className="text-black p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {value}
                </p>
            ) : (
                <input
                    className="text-black p-3 bg-gray-50 rounded-lg border border-gray-200"
                    value={value}
                />
            )}
        </div>
    );
}
