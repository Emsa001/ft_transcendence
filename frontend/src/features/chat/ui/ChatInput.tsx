import React from "react";

interface ChatInputProps {
    input: string;
    setInput: (value: string) => void;
    onSend: () => void;
}

export function ChatInput({ input, setInput, onSend }: ChatInputProps) {
    return (
        <div className="h-16 border-t border-gray-800 bg-black/50 flex items-center px-4 space-x-2 shadow-[0_0_15px_rgba(0,255,255,0.4)]">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput((e.target as HTMLInputElement).value)}
                onKeyDown={(e) => e.key === "Enter" && onSend()}
                className="flex-1 border border-cyan-500 bg-black/50 text-cyan-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-[0_0_6px_rgba(0,255,255,0.6)]"
                placeholder="Type a message..."
            />
            <button
                onClick={onSend}
                className="bg-cyan-500 text-black rounded-lg px-4 py-2 shadow-[0_0_6px_rgba(0,255,255,0.6)]"
            >
                Send
            </button>
        </div>
    );
}
