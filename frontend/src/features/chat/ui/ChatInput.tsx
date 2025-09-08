import React, { useState, useRef } from "react";
import { useChat } from "../model/ChatContext";
import { useLanguage } from "@features/language/model/useLanguage";
import { Toast } from "@shared/lib/Toast";
import GameApi from "../../game/service/GameApi";

let errorTimeout: NodeJS.Timeout;

export const ChatInput = () => {
    const [input, setInput] = useState("");
    const [error, setError] = useState("");

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

    const handleInvite = async () => {
        try {
            const res = await GameApi.createGame({
                isPrivate: true,
            });
            sendMessage(`/invite ${res.data.code}`);
            window.open(`/game/remote/casual/${res.data.code}`, "_blank");
        } catch (e) {
            Toast.error("You are already in a game!");
        }
    };

    return (
        <div className="flex flex-col border-t border-gray-800 bg-gray-800/20">
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
                    className="flex-1 border border-cyan-700 bg-gray-800/20 text-cyan-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                    placeholder={texts.sendPlaceholder}
                />
                <button
                    onClick={handleSend}
                    className="bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg px-4 py-2 shadow-[0_0_6px_rgba(0,255,255,0.6)] transition"
                >
                    {texts.send}
                </button>
                <button
                    onClick={handleInvite}
                    className="bg-purple-500 hover:bg-purple-400 text-black rounded-lg px-4 py-2 shadow-[0_0_6px_rgba(200,0,255,0.6)] transition"
                >
                    {texts.invite}
                </button>
            </div>
        </div>
    );
};
