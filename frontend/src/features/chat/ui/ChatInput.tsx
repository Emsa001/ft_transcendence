import React, { useRef, useState } from "react";

interface ChatInputProps {
    input: string;
    setInput: (value: string) => void;
    onSend: () => void;
}

let errorTimeout: NodeJS.Timeout;

export function ChatInput({ input, setInput, onSend }: ChatInputProps) {
    const [error, setError] = useState("");
    const lastSentTime = useRef<number>(0);

    const showError = (msg: string) => {
        clearTimeout(errorTimeout);
        setError(msg);
        errorTimeout = setTimeout(() => setError(""), 1000);
    };

    const handleSend = () => {
        const now = Date.now();

        if (!input.trim()) return;

        if (now - lastSentTime.current < 1000) {
            showError(
                "⏳ Please wait 1 second before sending another message."
            );
            return;
        }

        if (input.length > 500) {
            showError("❌ Message too long (max 500 characters).");
            return;
        }

        setError("");
        lastSentTime.current = now;
        onSend();
        setInput("");
    };

    return (
        <div className="flex flex-col border-t border-gray-800 bg-black/50 shadow-[0_0_15px_rgba(0,255,255,0.4)]">
            {error && (
                <div className="text-red-500 text-sm px-4 pt-1 transition-opacity duration-300">
                    {error}
                </div>
            )}

            <div className="h-16 flex items-center px-4 space-x-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) =>
                        setInput((e.target as HTMLInputElement).value)
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1 border border-cyan-500 bg-black/50 text-cyan-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-[0_0_6px_rgba(0,255,255,0.6)]"
                    placeholder="Type a message..."
                />
                <button
                    onClick={handleSend}
                    className="bg-cyan-500 text-black rounded-lg px-4 py-2 shadow-[0_0_6px_rgba(0,255,255,0.6)]"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
