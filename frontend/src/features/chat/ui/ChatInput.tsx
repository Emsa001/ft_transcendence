import React, { useState, useRef } from "react";
import { useChat } from "../model/ChatContext";
import { useLanguage } from "@features/language/model/useLanguage";

let errorTimeout: NodeJS.Timeout;

export const ChatInput = () => {
    const [input, setInput] = useState("");
    const [error, setError] = useState("");
    const [lobbyCode, setLobbyCode] = useState("");
    const [showInvite, setShowInvite] = useState(false);

    const { getText } = useLanguage();
    const texts = getText("chat");

    const lastSentTime = useRef<number>(0);
    const { sendMessage, isBlocked } = useChat();

    const showError = (msg: string) => {
        clearTimeout(errorTimeout);
        setError(msg);
        errorTimeout = setTimeout(() => setError(""), 1500);
    };

    const checkErrors = (input: string) => {
        const now = Date.now();
        if (!input.trim()) return false;
        if (isBlocked) {
            showError(texts.blockUserError);
            return false;
        }
        if (now - lastSentTime.current < 100) {
            showError(texts.fastMessage);
            return false;
        }
        lastSentTime.current = now;
        if (!input.trim()) {
            showError(texts.emptyMessage);
            return false;
        }
        if (input.length > 500) {
            showError(texts.longMessage);
            return false;
        }
        return true;
    };

    const handleSend = () => {
        if (!checkErrors(input)) return;
        sendMessage(input);
        setInput("");
    };

    const handleInvite = () => {
        if (!checkErrors(lobbyCode)) return;
        sendMessage(`lobby Code: ${lobbyCode}`);
        setLobbyCode("");
        setShowInvite(false);
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
                    onChange={(e: any) => setInput(e.target.value as any)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1 border border-cyan-500 bg-black/50 text-cyan-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-[0_0_6px_rgba(0,255,255,0.6)]"
                    placeholder={texts.sendPlaceholder}
                />
                <button
                    onClick={handleSend}
                    className="bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg px-4 py-2 shadow-[0_0_6px_rgba(0,255,255,0.6)] transition"
                >
                    {texts.send}
                </button>
                <button
                    onClick={() => setShowInvite(!showInvite)}
                    className="bg-purple-500 hover:bg-purple-400 text-black rounded-lg px-4 py-2 shadow-[0_0_6px_rgba(200,0,255,0.6)] transition"
                >
                    {texts.invite}
                </button>
            </div>

            {showInvite && (
                <div className="flex items-center px-4 pb-3 space-x-2 animate-fadeIn">
                    <input
                        type="text"
                        value={lobbyCode}
                        onChange={(e: any) =>
                            setLobbyCode(e.target.value as any)
                        }
                        onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                        className="flex-1 border border-purple-500 bg-black/50 text-purple-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-[0_0_6px_rgba(200,0,255,0.6)]"
                        placeholder={texts.sendInvitePlaceholder}
                    />
                    <button
                        onClick={handleInvite}
                        className="bg-purple-500 hover:bg-purple-400 text-black rounded-lg px-4 py-2 shadow-[0_0_6px_rgba(200,0,255,0.6)] transition"
                    >
                        {texts.sendInvite}
                    </button>
                </div>
            )}
        </div>
    );
};
